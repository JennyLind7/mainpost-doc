The models_performance function accesses MLflow to retrieve the performance data of models from the 'LightGBMModel_multiple' experiment. The completed run data is converted into a Pandas DataFrame.

<details open>
<summary>Model Performance</summary>

```
import mlflow

def models_performance():
    """
    get Models performance from mlflow
    return as pandas dataframe
    """
    experiment = mlflow.get_experiment_by_name("LightGBMModel_multiple")
    runs_df = mlflow.search_runs(experiment_ids=[experiment.experiment_id])
    runs_df = runs_df[runs_df['status'] == 'FINISHED']
    runs_df.drop(columns=['run_id', 'experiment_id', 'status', 'artifact_uri', 'tags.mlflow.log-model.history'], inplace=True)
    runs_df['name'] = experiment.name

    return runs_df

```
</details>