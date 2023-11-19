Detailed data pre-processing is essential to transform raw data into a structured, cleansed form. This improves the quality of the analysis results and enables precise predictions, which in turn strengthens decision-making and operational efficiency.
The data we worked with was made available in csv files. 
<br>
<br>
A central directory of our application contains essential pre-processing files as well as the implemented connectors for the Supabase database and the weather API. These files play a crucial role in the processing and integration of the data provided.
These files can be found in the [data_scripts](https://github.com/UHPDome/backend_mainpost/tree/main/development/src/data_scripts) subfolder of the src directory
<br>
To manage and facilitate access to the data, we store our data in Supabase's postgres database. 

## Preprocess Absences
The following file processes and transforms a dataframe from supabase to daily absences and filters for absence reason. The resulting dataframe is saved as a csv file.

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

## 