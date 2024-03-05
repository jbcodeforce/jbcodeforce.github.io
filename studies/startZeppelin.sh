docker run -u $(id -u) -p 8080:8080 -p 4040:4040 -p 6789:6789 -v $PWD/logs:/logs -v $HOME/Code/Studies/zeppelin-notebook:/notebooks \
           -e ZEPPELIN_LOG_DIR='/logs' -e ZEPPELIN_NOTEBOOK_DIR='/notebooks'  \
            -v $HOME/Code/Studies/spark-3.5.0-bin-hadoop3:/opt/spark -e SPARK_HOME=/opt/spark\
           --name zeppelin apache/zeppelin:0.10.1