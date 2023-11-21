Detailed data pre-processing is essential to transform raw data into a structured, cleansed form. This improves the quality of the analysis results and enables precise predictions, which in turn strengthens decision-making and operational efficiency.
The data we worked with was made available in csv files. 
<br>
<br>
A central directory of our application contains essential pre-processing files as well as the implemented connectors for the Supabase database and the weather API. These files play a crucial role in the processing and integration of the data provided.
These files can be found in the [data_scripts](https://github.com/UHPDome/backend_mainpost/tree/main/development/src/data_scripts) subfolder of the src directory.


## Database Connector
This script provides functions for interacting with our Supabase database. The functions enable data to be loaded as a DataFrame, the latest entry to be retrieved from a table, data to be inserted into a table and data to be updated in a table.

<details>
<summary>supabase_connector.py</summary>

```
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
def load_dataframe(name):
    """
    takes name of supabase table as string
    loads the table from supabase
    returns the table as dataframe
    """
    data = supabase.table(name).select("*").execute()
    data_json = data.model_dump_json()
    data_json = json.loads(data_json)
    df = pd.DataFrame(data_json["data"])
    if 'date' in df.columns:
        df['date'] = pd.to_datetime(df['date'])
    return df

def load_dataframe_latest(name):
    """
    loads the latest entry of a supabase table to cut waiting time
    """
    data, count = supabase.table(name).select('*').order('date', desc=True).limit(1).execute()
    df = pd.DataFrame(data[1])
    if 'date' in df.columns:
        df['date'] = pd.to_datetime(df['date'])
    return df

def insert_supabase(name, df):
    """
    takes name of supabase table as string and dataframe
    inserts the dataframe into the supabase table
    """
    df_json = df.to_json(orient='records')
    df_json = json.loads(df_json)
    data = supabase.table(name).insert(df_json).execute()
    

def update_supabase(name, df):
    """
    takes name of supabase table as string and dataframe
    updates the supabase table with the dataframe
    """
    data = supabase.table("countries").update({"country": "Indonesia", "capital_city": "Jakarta"}).eq("id", 1).execute()

```
</details>

## Weather Connector
This script retrieves weather data from the Visual Crossing Weather API and integrates it into a DataFrame that is used to forecast absences. The functions *_load_dataframe* loads weather data based on a start and end date, *_get_transform_weather* transforms the data by encoding weather conditions one-hot, and *_get_non_intersect_columns* adds non-overlapping columns required for the model. Finally, the *get_weather_data* function returns the transformed covariates data frame, which contains weather information as well as area and reason for absence.

<details>
<summary>crossingweather_connector.py</summary>

```
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

def _load_dataframe(StartDate='', EndDate=''):
    """
    takes in a start and end date as string
    loads weather data from Visual Crossing Weather API
    if no start and end date is given, loads 15 day forecast data
    returns the weather data as dataframe
    """

    Params = '&aggregateHours=24&unitGroup=metric'#&contentType=json'
    
    if len(StartDate)>0:
        print(' - Fetching history for date: ', StartDate,'-',EndDate)

        # History requests require a date.  We use the same date for start and end since we only want to query a single date in this example
        QueryDate = '&startDateTime=' + StartDate + 'T00:00:00&endDateTime=' +EndDate + 'T00:00:00'
        QueryTypeParams = 'history?'+ Params + '&dayStartTime=0:0:00&dayEndTime=0:0:00' + QueryDate
    
    else:
        print(' - Fetching forecast data')
        QueryTypeParams = 'forecast?'+ Params + '&shortColumnNames=false'

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

def _get_transform_weather(startdate, enddate):
    """
    takes in a start and end date as string
    calls _load_dataframe to load weather data
    transforms the weather data by one-hot encoding weather conditions
    returns the transformed weather data as dataframe
    """
    if startdate > enddate:
        past_df = _load_dataframe()
    else:
        past_df = _load_dataframe(StartDate=startdate, EndDate=enddate)

    past_df = past_df.rename(columns={'Date time':'date', 'Temperature': 'temp', 'Maximum Temperature':'tempmax', 'Minimum Temperature':'tempmin', 'Conditions':'conditions'})
    past_df = past_df[['date', 'temp', 'tempmax', 'tempmin', 'conditions']]
    past_df = pd.get_dummies(past_df, columns = ['conditions'], prefix='', prefix_sep='', dtype=int)
    return past_df

def _get_non_intersect_columns(weather_df, covariates_df):
    """
    takes in weather and covariates dataframe
    gets the non intersecting columns of weather and covariates dataframe
    joins the non intersecting columns to the weather dataframe and fills with 0 
    required for the model to function
    returns the resulting dataframe
    """
    intersect_cols = set(weather_df.columns).intersection(set(covariates_df.columns))
    non_intersect_cols = [col for col in covariates_df.columns if col not in intersect_cols]
    non_intersect_cols.remove('id')
    covariates_return = pd.concat([weather_df, pd.DataFrame(columns=non_intersect_cols)], axis=1)
    covariates_return.fillna(0, inplace=True)
    covariates_return['date'] = pd.to_datetime(covariates_return['date'])
    return covariates_return

def _add_reason_id(noint, covariates):
    """
    takes in the non intersecting dataframe and the covariates dataframe
    adds the area_id and reason to the covariates dataframe
    returns the covariates dataframe for every area and reason
    """

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
    
def get_weather_data(covariates, StartDate='', EndDate=''):
    """
    takes in the covariates dataframe and a start and end date as string
    calls above functions to load and transform the weather data
    returns the transformed covariates data
    """
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
import pandas as pd
import data_scripts.supabase_connector as supabase_connector

def _join_bezirk_to_absences(df):
    """
    Joins the area_id to the absences
    takes in a dataframe
    returns the joined dataframe
    """
    allocations_df = supabase_connector.load_dataframe("allocations")
    allocations_df.rename(columns={'id':'allocation_id'}, inplace=True)
    rounds_df = supabase_connector.load_dataframe("districts")

    bezirk_df = allocations_df.merge(rounds_df, how='left', left_on='district_id', right_on='id')
    bezirk_df = bezirk_df[['district_id', 'allocation_id', 'area_id']].drop_duplicates()

    df = df.merge(bezirk_df, how='left', left_on='allocation_id', right_on='allocation_id')
    return df

def load_and_preprocess_absences():
    """
    Loads the absences data and transposes it to daily data instead of ranges 
    calls above functions to join the area_id to the absences
    saves the transformed dataframe
    returns the transformed dataframe
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

    #absences_df.to_csv('../data/interim/absences_daily.csv', index=False)
    
    return absences_df

def _sum_df(df):
    """
    Sums the absences per day, area_id and reason
    takes in a dataframe
    returns the summed dataframe"""
    df = df.drop(columns=['employee_id', 'allocation_id', 'id', 'district_id'])
    #df = df.groupby(['date']).sum().reset_index()
    df = df.groupby(['area_id','date', 'reason']).sum().sort_values('date').reset_index()
    return df

def _fill_data(DataFrame):  
    """
    Fills the dataframe with 0 for days where there are no absences for every area_id and reason
    takes in a dataframe
    returns the filled dataframe
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

def transform_absences(absences_df):
    """
    Transforms the absences data and saves it, by calling above functions
    loads from interim data and saves to processed data
    excludes the area_id 2.6 Z&S and 2.8 Z&S due to issues with darts
    """
    
    #drop non float old area_id due to issues with darts
    absences_df = absences_df[absences_df.area_id != '2.6 Z&S']
    absences_df = absences_df[absences_df.area_id != '2.8 Z&S']
    absences_df = absences_df.reset_index(drop=True)   
    absences_df['count'] = 1

    absences_complete = _sum_df(absences_df)
    absences_complete = _fill_data(absences_complete)

    absences_complete.to_csv('../data/processed/absences_daily_multiple_m_reason.csv', index=False)
    #return absences_complete, absences_vacation, absences_illness

#only fill for area id not accounting for reason

#def _fill_data(DataFrame):
#    DataFrame_filled = DataFrame.copy()
#    for area_id in DataFrame['area_id'].unique():
#        DataFrame_Slice = DataFrame[DataFrame['area_id']==area_id]
#        Bool_Series = pd.DataFrame({'date':DataFrame['date'].unique()})
#        Bool_Series['isinbool'] = pd.DataFrame(DataFrame['date'].unique()).isin(DataFrame_Slice['date'].unique())
#        Bool_Series = Bool_Series[Bool_Series['isinbool']==False]
#        Bool_Series['count'] = 0
#        Bool_Series['area_id'] = area_id
#        Bool_Series=Bool_Series.drop(['isinbool'], axis=1)
#        DataFrame_filled = pd.concat([DataFrame_filled, Bool_Series])
#
#    DataFrame_filled = DataFrame_filled.reset_index(drop=True)
#    return DataFrame_filled


#def transform_absences():
#    absences_df = pd.read_csv('../../data/interim/absences_daily.csv')
#    
#    #drop non float old area_id due to issues with darts
#    absences_df = absences_df[absences_df.area_id != '2.6 Z&S']
#    absences_df = absences_df[absences_df.area_id != '2.8 Z&S']
#    absences_df = absences_df.reset_index(drop=True)
#    
#    absences_df['count'] = 1
#    absences_complete = absences_df
#    absences_vacation = absences_df[absences_df['reason']=='vacation']
#    absences_illness = absences_df[absences_df['reason']=='illness']
#
#    absences_complete = _sum_df(absences_complete)
#    absences_complete = _fill_data(absences_complete)
#
#    absences_vacation = _sum_df(absences_vacation)
#    absences_vacation = _fill_data(absences_vacation)
#
#    absences_illness = _sum_df(absences_illness)
#    absences_illness = _fill_data(absences_illness)
#
#    absences_complete.to_csv('../../data/processed/absences_bezirk_complete.csv', index=False)
#    absences_vacation.to_csv('../../data/processed/absences_bezirk_vacation.csv', index=False)
#    absences_illness.to_csv('../../data/processed/absences_bezirk_illness.csv', index=False)
#    #return absences_complete, absences_vacation, absences_illness

```
</details>

## Build Covariates
This script processes time series data to forecast absences. The function create_datetime_features adds temporal features to a DataFrame. The *_transform_save_weather* and *_join_id_reason_to_covariates* functions transform and integrate weather data as well as information on the area and reason for absence. The *load_and_preprocess_weather* function loads weather data, transforms it and adds additional information to create a standardised DataFrame for further analysis.

<details>
<summary>build_covariates.py</summary>

```
import pandas as pd
import data_scripts.supabase_connector as supabase_connector

def create_datetime_features(df):
    """
    Creates time series features from datetime index
    Only needed for none darts testing purposes
    takes in a dataframe
    returns the dataframe with additional time series features
    """
    df['dayofweek'] = df['date'].dt.dayofweek
    df['quarter'] = df['date'].dt.quarter
    df['month'] = df['date'].dt.month
    df['year'] = df['date'].dt.year
    df['dayofyear'] = df['date'].dt.dayofyear
    df['dayofmonth'] = df['date'].dt.day
    df['weekofyear'] = df['date'].dt.isocalendar()['week']
    return df


def _transform_save_weather(df, name):
    """
    Transforms and saves weather data, by one-hot encoding weather conditions
    takes in a dataframe and the name for the file to save
    saves the transformed dataframe
    was only needed for initial transformation and save of the external weather data
    returns the transformed dataframe
    """
    df['date'] = df['datetime']
    df = df.drop(columns=['datetime'])
    df = df[['date', 'temp', 'tempmax', 'tempmin', 'conditions']]
    df = pd.get_dummies(df, columns = ['conditions'], prefix='', prefix_sep='', dtype=int)
    df.to_csv(f'../data/processed/{name}.csv', index=False)
    return df

def _join_id_reason_to_covariates(covariates):
    """
    joins the area_id and reason to the covariates dataframe
    takes in the covariates dataframe
    returns the covariates dataframe for every area and reason
    """
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

def load_and_preprocess_weather():
    """
    Loads the weather data and calls above functions to transform and save the data
    returns the transformed dataframe
    """
    weather_past_df = pd.read_csv('../data/external/weather_df.csv', delimiter=',', parse_dates=['datetime'])
    weather_past_df = _transform_save_weather(weather_past_df, "covariates_past_single")
    weather_past_df = _join_id_reason_to_covariates(weather_past_df)
 
    return weather_past_df

```
</details>

## Update Covariates
This code updates the covariates table for the forecast of absences. Firstly, data is loaded from the 'absences_daily' and 'covariates' tables. A start date for the update is then defined, which is one day after the last date available in the covariates table. If new data is available, weather data for the period between the specified start date and today's date is retrieved and inserted into the covariates table.

<details>
<summary>update_covariates.py</summary>

```
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

def update_covariates():
    """
    calls functions from crossingweather_connector and supabase_connector to update the covariates table
    """
    if startdate > enddate:
        print('No new data available')
    else:
        covariates_df = crossingweather_connector.get_weather_data(covariates, startdate, enddate)
        supabase_connector.insert_supabase('covariates', covariates_df)

```
</details>