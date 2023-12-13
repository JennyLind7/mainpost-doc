In this section, the various models for prediction are defined, optimised, trained and recorded in more detail.

## Logging Experiments
This script implements functions for logging time series models in MLflow. The mlflow_ts function accepts a time series model, experiment names, time series, past covariates, run and model names, parameters, metrics and artefacts (images). It splits the time series into training and test sets, fits the model to the training data, creates an MLflow run and logs the model, parameters, metrics and artefacts using the _logging_mlflow function. The entire run is logged on a local MLflow server with the tracking URI 'http://localhost:5000'.
<br>
<br>
<span style="margin-left:20px;"># mlflow logging function:</span>
```
def mlflow_ts(model, experiment_name, timeseries, past_covariates, run_name, model_name, params:dict, metrics={}, artifacts={}, future_covariates=None)

```
<i class="fas fa-folder"></i> The **logging_saved.py** script can be found in the [/development/src/models](https://github.com/UHPDome/backend_mainpost/blob/main/development/src/models/logging_saved.py){:target="_blank"} directory. 

---

## Metrics
These functions calculate aggregated evaluation metrics for predictions of time series models in comparison to test time series. The metrics include the overall averaged RMSE (Root Mean Squared Error), MAE (Mean Absolute Error), MAPE (Mean Absolute Percentage Error) and MASE (Mean Absolute Scaled Error). The calculations are carried out using the Darts library, whereby the functions are parallelised to several processor cores (by using the parameter n_jobs=-1).
<br>
<br>
We wanted to use the MAPE (Mean Absolute Percentage Error) as it provides a quick and easy-to-understand measure of how well a model performed. Furthermore, is a percentage metric of special interest because it makes it easier to compare the different models in which the absolute predicted absences may differ. However, calculating MAPE requires dividing by the actual absences, which are often zero for individual districts. As this division is not feasible, we chose to utilize alternative metrics such as RMSE (Root Mean Squared Error), MAE (Mean Absolute Error), and MASE (Mean Absolute Scaled Error).
<br>
<br>
<i class="fas fa-folder"></i> The **metrics.py** script can be found in the [/development/src/models](https://github.com/UHPDome/backend_mainpost/blob/main/development/src/models/metrics.py){:target="_blank"} directory. 

---

## Models
This script contains functions for modelling and training various time series models, including LightGBM, XGBoost (XGB), TCN (Temporal Convolutional Network) and TFT (Temporal Fusion Transformer). It uses the Darts library for time series predictions and implements functions for logging models, parameters, metrics and artefacts (such as prediction plots) in MLflow. The models are trained with both standard parameters and optimised hyperparameters and applied to absence time series data. The *train_models* function calls all other functions to train the different models.
<br>
<br>
We decided to use for our models two gradient boosting models because of their efficiency in regard to the needed computation time and their general very good performances. The algorithm is grounded on a tree search algorithm that combines several weaker models to achieve better predictions. The implemented models are XGBoost and LightGBM which are the state-of-the-art algorithms. Usually, LightGBM achieves a higher accuracy while being faster than XGBoost, but on the downside is more susceptible to overfitting.

In contrast to the gradient boosting models, we wanted to test two models which are based on the neural network technology. We chose the Temporal Convolutional Network (TCN) and the Temporal Fusion Transformer (TFT). TCN is specialized in extracting temporal patterns und relatively fast in comparison to other models based on neural networks architecture. The TFT architecture allows to capture intricate temporal relationships in data, by fusing information across multiple time series and related contextual data. Another advantage of the TFT architecture is that the feature importance can be measured which is not given for deep learning models. While TCN often requires less computing power than TFT, both TCN and TFT need more computational resources compared to gradient boosting models.
<br>
<br>
<i class="fas fa-folder"></i> The **models.py** script can be found in the [/development/src/models](https://github.com/UHPDome/backend_mainpost/blob/main/development/src/models/models.py){:target="_blank"} directory. 

---

## Optuna Hyperparameter
This script contains functions for hyperparameter optimisation for various time series models. It uses the Optuna library to find the best hyperparameters for models such as TCN (Temporal Convolutional Network), XGBoost (XGB), LightGBM and TFT (Temporal Fusion Transformer). The script defines objective functions that train the models and minimise the MASE metric on a validation set. The best hyperparameters found are then returned. The script also uses the Darts library for time series predictions and the PyTorch Lightning library for training models with Lightning callbacks. The utilized hyperparameter for each model can be found in the Darts documentation.
<br>
<br>
<i class="fas fa-folder"></i> The **optuna_hyperparameter.py** script can be found in the [/development/src/models](https://github.com/UHPDome/backend_mainpost/blob/main/development/src/models/optuna_hyperparameter.py){:target="_blank"} directory.

---

## Timeseries
The functions provided enable the loading and splitting of time series data for absence modelling. They transform data frames into Darts time series objects, split them for training and testing and enable the use of covariates for the prediction of absences over time.
<br>
<br>
<i class="fas fa-folder"></i> The **timeseries.py** script can be found in the [/development/src/models](https://github.com/UHPDome/backend_mainpost/blob/main/development/src/models/timeseries.py){:target="_blank"} directory.
