## Prediction Models
These functions use MLflow to load models for the prediction of past and future events. The models for past and future covariates are loaded separately. The predictions are then created using these models, transformed back and saved in CSV files for API calls.
<br>
<br>
<i class="fas fa-folder"></i> The **predictionmodels.py** script can be found in the [/development/src/prediction](https://github.com/UHPDome/backend_mainpost/blob/main/development/src/prediction/predictionmodels.py) directory. 

## Prediction Timeseries 
 The functions in this file update the data to the newest state. The functions *_modify_absences*, *_make_future_covs*, and *_process_dfs* process the DataFrames read in for absences, past and future covariates. Date modifications are made to ensure that the data is consistent. The function *load_transform_to_timeseries_multiple* then loads and transforms the modified DataFrames into Darts time series to prepare them for further processing in the models.
<br>
<br>
<i class="fas fa-folder"></i> The **predictiontimeseries.py** script can be found in the [/development/src/prediction](https://github.com/UHPDome/backend_mainpost/blob/main/development/src/prediction/predictiontimeseries.py) directory. 

## Model deployment
The functions *get_all_runs*, *get_prod_model_info* and *set_new_prod_model* work together to identify the best model from the past and future experiments and move it to the production environment. *set_production_pipeline* calls these functions to move the models for both past and future experiments to the production stage. Older models are archived and the best model from each experiment is moved to the production stage if it is not already there.
<br>
<br>
<i class="fas fa-folder"></i> The **set_production.py** script can be found in the [/development/src/prediction](https://github.com/UHPDome/backend_mainpost/blob/main/development/src/prediction/set_production.py) directory. 