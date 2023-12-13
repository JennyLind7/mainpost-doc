Detailed data pre-processing is essential to transform raw data into a structured, cleansed form. This improves the quality of the analysis results and enables precise predictions, which in turn strengthens decision-making and operational efficiency.
The data we worked with was made available in csv files. 
<br>
<br>
A central directory of our application contains essential pre-processing files as well as the implemented connectors for the Supabase database and the weather API. These files play a crucial role in the processing and integration of the data provided.
These files can be found in the [data_scripts](https://github.com/UHPDome/backend_mainpost/tree/main/development/src/data_scripts){:target="_blank"} subfolder of the src directory.


## Database Connector
This script provides functions for interacting with our Supabase database. The functions enable data to be loaded as a DataFrame, the latest entry to be retrieved from a table, data to be inserted into a table and data to be updated in a table.

<details>
<summary>supabase_connector.py</summary>

```
"""This script contains functions to connect to supabase. 

They contain functionality for loading from supabase, inserting into supabase and updating data in supabase
"""

import os 
from dotenv import load_dotenv
from supabase import create_client, Client
import pandas as pd
import json 
#import retry

load_dotenv()
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

#@retry(delay=5, tries=6)
def load_dataframe(name: str) -> pd.DataFrame:
    """Load table from supabase by name and transform to pandas dataframe"""
    data = supabase.table(name).select("*").execute()
    data_json = data.model_dump_json()
    data_json = json.loads(data_json)
    df = pd.DataFrame(data_json["data"])
    if 'date' in df.columns:
        df['date'] = pd.to_datetime(df['date'])
    return df

def load_dataframe_latest(name: str) -> pd.DataFrame:
    """Load the latest entry of a supabase table to cut waiting time"""
    data, count = supabase.table(name).select('*').order('date', desc=True).limit(1).execute()
    df = pd.DataFrame(data[1])
    if 'date' in df.columns:
        df['date'] = pd.to_datetime(df['date'])
    return df

def insert_supabase(name: str, df: pd.DataFrame) -> None:
    """inserts the dataframe into the supabase table"""
    df_json = df.to_json(orient='records')
    df_json = json.loads(df_json)
    data = supabase.table(name).insert(df_json).execute()
    

def update_supabase(name: str, df: pd.DataFrame) -> None:
    """Update the supabase table with the Dataframe."""
    data = supabase.table("countries").update({"country": "Indonesia", "capital_city": "Jakarta"}).eq("id", 1).execute()

```
</details>

## Weather Connector
This script retrieves weather data from the Visual Crossing Weather API and integrates it into a DataFrame that is used to forecast absences. The functions *_load_dataframe* loads weather data based on a start and end date, *_get_transform_weather* transforms the data by encoding weather conditions one-hot, and *_get_non_intersect_columns* adds non-overlapping columns required for the model. Finally, the *get_weather_data* function returns the transformed covariates data frame, which contains weather information as well as area and reason for absence.

<details>
<summary>crossingweather_connector.py</summary>

```
"""This file contains functions to load weather data from Visual Crossing Weather API and transform it.

There is the option to load 15 day forecast data or history data for a given daterange.
The data is transformed afterwards in different steps:
    1. one-hot encoding of weather conditions
    2. join non intersecting columns of weather and covariates dataframe
    3. add area_id and reason to the covariates dataframe
"""

import os
import pandas as pd
import csv
import codecs

from dotenv import load_dotenv
import urllib.request
import urllib.error
import sys
import data_scripts.supabase_connector as supabase_connector

load_dotenv()
BaseURL: str = os.environ.get("VISUALCROSSING_URL")
ApiKey: str = os.environ.get("VISUALCROSSING_KEY")

QueryLocation = '&location=' + 'Wuerzburg,Germany'
QueryKey = '&key=' + ApiKey

def _load_dataframe(StartDate: str = '', EndDate: str = ''):
    """Load weather data from Visual Crossing Weather API.

    If no start and end date is given, loads 15 day forecast data.
    Returns the weather data as Dataframe.
    """

    Params: str = '&aggregateHours=24&unitGroup=metric'#&contentType=json'
    
    if len(StartDate)>0:
        print(' - Fetching history for date: ', StartDate,'-',EndDate)

        # History requests require a date.  We use the same date for start and end since we only want to query a single date in this example
        QueryDate: str = '&startDateTime=' + StartDate + 'T00:00:00&endDateTime=' +EndDate + 'T00:00:00'
        QueryTypeParams: str = 'history?'+ Params + '&dayStartTime=0:0:00&dayEndTime=0:0:00' + QueryDate
    
    else:
        print(' - Fetching forecast data')
        QueryTypeParams: str = 'forecast?'+ Params + '&shortColumnNames=false'

    # Build the entire query
    URL = BaseURL + QueryTypeParams + QueryLocation + QueryKey

    try: 
        request = urllib.request.urlopen(URL)
    except urllib.error.HTTPError  as e:
        ErrorInfo= e.read().decode() 
        print('Error code: ', e.code, ErrorInfo)
        sys.exit()
    except  urllib.error.URLError as e:
        ErrorInfo= e.read().decode() 
        print('Error code: ', e.code,ErrorInfo)
        sys.exit()

    CSVText = csv.reader(codecs.iterdecode(request, 'utf-8'))

    value_list = []
    for row in CSVText:
        value_list.append(row)

    df = pd.DataFrame(columns=value_list[0])
    for i in range(1, len(value_list)):
        df.loc[len(df)] = value_list[i]

    return df

def _get_transform_weather(startdate: str, enddate: str) -> pd.DataFrame:
    """Load and Transform weather data.
    
    Call _load_dataframe and load weather data.
    Transform weather data by one-hot encoding weather conditions and keeping necessary columns.
    """
    if startdate > enddate:
        past_df = _load_dataframe()
    else:
        past_df = _load_dataframe(StartDate=startdate, EndDate=enddate)

    past_df = past_df.rename(columns={'Date time':'date', 'Temperature': 'temp', 'Maximum Temperature':'tempmax', 'Minimum Temperature':'tempmin', 'Conditions':'conditions'})
    past_df = past_df[['date', 'temp', 'tempmax', 'tempmin', 'conditions']]
    past_df = pd.get_dummies(past_df, columns = ['conditions'], prefix='', prefix_sep='', dtype=int)
    return past_df

def _get_non_intersect_columns(weather_df: pd.DataFrame, covariates_df: pd.DataFrame) -> pd.DataFrame:
    """Get the non intersecting columns of weather and covariates dataframe to create a complete Table.

    The columns from the initial covariates table cover all the weather conditions and thus are used to extent the current covariates table that usually only contains a few conditions (e.g. rain, snow, fog).
    The non intersecting column are joined to the weather dataframe and are filled with 0s. 
    """
    intersect_cols = set(weather_df.columns).intersection(set(covariates_df.columns))
    non_intersect_cols = [col for col in covariates_df.columns if col not in intersect_cols]
    non_intersect_cols.remove('id')
    covariates_return = pd.concat([weather_df, pd.DataFrame(columns=non_intersect_cols)], axis=1)
    covariates_return.fillna(0, inplace=True)
    covariates_return['date'] = pd.to_datetime(covariates_return['date'])
    return covariates_return

def _add_reason_id(noint:pd.DataFrame, covariates: pd.DataFrame) -> pd.DataFrame:
    """Add the area_id and reason to the covariates Dataframe."""

    noint_reason = pd.DataFrame()

    for reason in covariates.reason.unique():
        noint.reason = reason
        noint_reason = pd.concat([noint, noint_reason])

    noint_reason_area = pd.DataFrame()
        
    for area_id in covariates.area_id.unique():
        noint_reason.area_id = area_id
        noint_reason_area = pd.concat([noint_reason, noint_reason_area])

    noint_reason_area.reset_index(inplace=True, drop=True)

    noint_reason_area['id'] = noint_reason_area.index + max(covariates['id'].astype(int))+1
    noint_reason_area['date'] = noint_reason_area['date'].astype(str)   
    
    return noint_reason_area
    
def get_weather_data(
        covariates: pd.DataFrame, 
        StartDate: str = '', 
        EndDate: str = '') -> pd.DataFrame:
    """Calls above functions to load and transform the weather data."""
    weather_df = _get_transform_weather(StartDate, EndDate)
    no_int = _get_non_intersect_columns(weather_df, covariates)
    noint_reason_area =_add_reason_id(no_int, covariates)
    return noint_reason_area

```
</details>

## Preprocess Absences
This script processes and transforms absence data by assigning it to an area (district) and converting it to daily data. The absence reasons 'holiday' and 'illness' are taken into account. The resulting DataFrame is then totalled and filled with zeros for days without absences. The script also excludes specific area IDs ('2.6 Z&S' and '2.8 Z&S') and saves the transformed DataFrame as a CSV file.

<details>
<summary>preprocess_absences.py</summary>

```
"""This script loads and transforms the absences data.

This is a multistep process:
    1. Transpose to daily data per row instead of ranges in columns.
    2. Join area_id and reason to the absences
    3. Sum up absences per day, area_id and reason
    4. Fill Dataframe with 0 for days where there are no absences

The resulting data is used to train the timeseries forecasting model and contains the prediction variable.
The file is only needed for initalization of the supabase table for absences.
"""

import pandas as pd
import data_scripts.supabase_connector as supabase_connector

def _join_bezirk_to_absences(df: pd.DataFrame) -> pd.DataFrame:
    """Join area_id to the absences"""
    allocations_df = supabase_connector.load_dataframe("allocations")
    allocations_df.rename(columns={'id':'allocation_id'}, inplace=True)
    rounds_df = supabase_connector.load_dataframe("districts")

    bezirk_df = allocations_df.merge(rounds_df, how='left', left_on='district_id', right_on='id')
    bezirk_df = bezirk_df[['district_id', 'allocation_id', 'area_id']].drop_duplicates()

    df = df.merge(bezirk_df, how='left', left_on='allocation_id', right_on='allocation_id')
    return df

def load_and_preprocess_absences() -> pd.DataFrame:
    """Load absences data and transpose to daily data instead of ranges.
    
    Transposition is done with a list comprehension that is significantly faster then other tested methods (for loops f.e.).
    Call _join_bezirk_to_absences to join the area_id to the absences.
    """
    absences_df = supabase_connector.load_dataframe("absences")
    absences_df = absences_df.dropna(subset=['start_date', 'end_date'])
    absences_df = absences_df[absences_df['reason'].isin(['vacation', 'illness'])]
    absences_df = pd.concat([pd.DataFrame({'date': pd.date_range(row.start_date, row.end_date),
               'employee_id': row.employee_id,
               'allocation_id': row.allocation_id,
               'id':row.id,
               'reason':row.reason}, columns=['date', 'employee_id', 'allocation_id','id', 'reason']) 
           for i, row in absences_df.iterrows()], ignore_index=True)
    absences_df['date'] = pd.to_datetime(absences_df['date'])

    absences_df = _join_bezirk_to_absences(absences_df)
    
    return absences_df

def _sum_df(df: pd.DataFrame) -> pd.DataFrame:
    """Sum up absences per day, area_id and reason."""
    df = df.drop(columns=['employee_id', 'allocation_id', 'id', 'district_id'])
    df = df.groupby(['area_id','date', 'reason']).sum().sort_values('date').reset_index()
    return df

def _fill_data(DataFrame: pd.DataFrame) -> pd.DataFrame:  
    """Fill absence Dataframe with 0 for days where there are no absences.

    This is important for the timeseries forecasting models with darts, because the every timeseries of the multiple timeseries need to have the same length.
    """
    DataFrame_filled = DataFrame.copy()
    for area_id in DataFrame['area_id'].unique():
        for reason in DataFrame['reason'].unique(): 
            DataFrame_Slice = DataFrame[DataFrame['area_id']==area_id]
            DataFrame_Slice = DataFrame_Slice[DataFrame_Slice['reason']==reason]
            Bool_Series = pd.DataFrame({'date':DataFrame['date'].unique()})
            Bool_Series['isinbool'] = pd.DataFrame(DataFrame['date'].unique()).isin(DataFrame_Slice['date'].unique())
            Bool_Series = Bool_Series[Bool_Series['isinbool']==False]
            Bool_Series['count'] = 0
            Bool_Series['area_id'] = area_id
            Bool_Series['reason'] = reason
            Bool_Series=Bool_Series.drop(['isinbool'], axis=1)
            DataFrame_filled = pd.concat([DataFrame_filled, Bool_Series])

    DataFrame_filled = DataFrame_filled.reset_index(drop=True)
    return DataFrame_filled

def transform_absences(absences_df: pd.DataFrame) -> pd.DataFrame:
    """Transform and save absences data.

    This function calls above functions and thus functions as a datapipeline with minimal transformations added.
    That is the exclution of the area_id 2.6 Z&S and 2.8 Z&S. 
    """
    absences_df = load_and_preprocess_absences()
    absences_df = absences_df[absences_df.area_id != '2.6 Z&S']
    absences_df = absences_df[absences_df.area_id != '2.8 Z&S']
    absences_df = absences_df.reset_index(drop=True)   
    absences_df['count'] = 1

    absences_complete = _sum_df(absences_df)
    absences_complete = _fill_data(absences_complete)

    absences_complete.to_csv('../data/processed/absences_daily_multiple_m_reason.csv', index=False)
    

```
</details>

## Build Covariates
This script processes time series data to forecast absences. The function create_datetime_features adds temporal features to a DataFrame. The *_transform_save_weather* and *_join_id_reason_to_covariates* functions transform and integrate weather data as well as information on the area and reason for absence. The *load_and_preprocess_weather* function loads weather data, transforms it and adds additional information to create a standardised DataFrame for further analysis.

<details>
<summary>build_covariates.py</summary>

```
"""This script is used to build the covariates for training the timeseries forecasting model.

It contains code that transforms the external weather data and joins it to the area and reason specific internal data.
Is only needed for inital transformation of the external weatherdata, to initialize the supabase table for covariates.
"""

import pandas as pd
import data_scripts.supabase_connector as supabase_connector

def create_datetime_features(df: pd.DataFrame) -> pd.DataFrame:
    """Create time series features from datetime index.

    Only needed for none darts testing purposes.
    Returns the dataframe with additional time series features.
    """
    df['dayofweek'] = df['date'].dt.dayofweek
    df['quarter'] = df['date'].dt.quarter
    df['month'] = df['date'].dt.month
    df['year'] = df['date'].dt.year
    df['dayofyear'] = df['date'].dt.dayofyear
    df['dayofmonth'] = df['date'].dt.day
    df['weekofyear'] = df['date'].dt.isocalendar()['week']
    return df


def _transform_save_weather(df: pd.DataFrame, name: str) -> pd.DataFrame:
    """Transform and save weather data.
     
    Use one-hot encoding for weather conditions.
    Save the transformed dataframe by given name to csv.
    """
    df['date'] = df['datetime']
    df = df.drop(columns=['datetime'])
    df = df[['date', 'temp', 'tempmax', 'tempmin', 'conditions']]
    df = pd.get_dummies(df, columns = ['conditions'], prefix='', prefix_sep='', dtype=int)
    df.to_csv(f'../data/processed/{name}.csv', index=False)
    return df

def _join_id_reason_to_covariates(covariates: pd.DataFrame) -> pd.DataFrame:
    """Join area_id and reason to the covariates Dataframe."""
    reason_df = pd.DataFrame()
    absences_df = supabase_connector.load_dataframe("absences_daily")

    for reason in absences_df.reason.unique():
        covariates.reason = reason
        reason_df = pd.concat([covariates, reason_df])

    reason_df_area = pd.DataFrame()
        
    for area_id in absences_df.area_id.unique():
        reason_df.area_id = area_id
        reason_df_area = pd.concat([reason_df, reason_df_area])

    reason_df_area.reset_index(inplace=True, drop=True)
    reason_df_area['date'] = reason_df_area['date'].astype(str)   
    
    return reason_df_area

def load_and_preprocess_weather() -> pd.DataFrame:
    """Load Data and call above functions.

    transforms and saves the weather data and returns the resulting Dataframe.
    """
    weather_past_df = pd.read_csv('../data/external/weather_df.csv', delimiter=',', parse_dates=['datetime'])
    weather_past_df = _transform_save_weather(weather_past_df, "covariates_past_single")
    weather_past_df = _join_id_reason_to_covariates(weather_past_df)
    weather_past_df.to_csv('../data/processed/covariates_past_multiple_m_reason.csv', index=False)
    return weather_past_df

```
</details>

## Update Covariates
This code updates the covariates table for the forecast of absences. Firstly, data is loaded from the 'absences_daily' and 'covariates' tables. A start date for the update is then defined, which is one day after the last date available in the covariates table. If new data is available, weather data for the period between the specified start date and today's date is retrieved and inserted into the covariates table.

<details>
<summary>update_covariates.py</summary>

```
"""This script wraps the functions from crossingweather_connector and supabase_connector to update the covariates table."""
import os
import pandas as pd
import json 
from datetime import date, timedelta

import data_scripts.supabase_connector as supabase_connector
import data_scripts.crossingweather_connector as crossingweather_connector
from data_scripts.build_covariates import create_datetime_features

absences_df = supabase_connector.load_dataframe("absences_daily")
covariates = supabase_connector.load_dataframe("covariates")

startdate= str(covariates['date'].max().date() + timedelta(days=1))
enddate = str(date.today())

def update_covariates() -> None:
    """call functions from crossingweather_connector and supabase_connector to update the covariates table"""
    if startdate > enddate:
        print('No new data available')
    else:
        covariates_df = crossingweather_connector.get_weather_data(covariates, startdate, enddate)
        supabase_connector.insert_supabase('covariates', covariates_df)

```
</details>