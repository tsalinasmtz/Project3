# This is the main script.
from flask import Flask, jsonify, render_template

import pandas as pd
from sqlalchemy import create_engine

# Create database connection
connection_string= 'postgresql+psycopg2://postgres:Mybeyonce1@localhost:5432/poblacion_db'
engine = create_engine(connection_string)

app = Flask(__name__)

# Code to return what was defined in Index.html
@app.route('/')
def main():
    return render_template('index.html')


@app.route('/api')
def api():
    # Return the total population per state
    response = pd.read_sql('select nom_ent, sum(pobtot) from poblacion_table group by nom_ent', engine)
    response = {
        'labels': response['nom_ent'].to_list(),
        'values': response['sum'].to_list(),
    }
    return response

@app.route('/api2')
def api2():
    # Return the total population with no access to healthcare insurance
    df = pd.read_sql("SELECT 'Mexico' AS country, SUM(pder_ss) AS total_hc, SUM(psinder) AS total_no_hc FROM poblacion_table", engine)
    df = {
        'labels': df['country'].tolist(),
        'values_total_hc': df['total_hc'].tolist(),
        'values_total_no_hc': df['total_no_hc'].tolist(),
}
    return df

@app.route('/api3')
def api3():
    # Return the total population from 12 to 14 years that is not assisting to school
    df2 = pd.read_sql("SELECT nom_ent, SUM(p_12a14) AS p_12a14, SUM(p12a14noa) AS p12a14noa FROM poblacion_table GROUP BY nom_ent", engine)

    df2 = {
        'labels': df2['nom_ent'].tolist(),
        'values_total_12_a_14': df2['p_12a14'].tolist(),
        'values_total_12_a_14_noa': df2['p12a14noa'].tolist(),
}
    return df2

if __name__ == '__main__':
    app.run(debug=False)