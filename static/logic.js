  // JSON USED FOR PLOT NO. 1

d3.json('http://127.0.0.1:5000/api').then(data => {

  d3.select('#my-dropdown').selectAll('option').data(data.labels).enter().append('option').text(d=>d).attr('value',d=>d)
  let trace1 = {
    x: data.labels,
    y: data.values,
    type: 'bar'
  };

  let layout = {
    title: 'Population by State',
    xaxis: {
      title: 'State'
    },
    yaxis: {
      title: 'Population'
    }
  };

  let plotData = [trace1];

  Plotly.newPlot('plot', plotData, layout);

  // Add event listener for dropdown menu
  let dropdown = document.getElementById('my-dropdown');
  dropdown.addEventListener('change', function() {
    let selectedState = dropdown.value;
    let userindex = data.labels.indexOf(selectedState)
    // Filter data based on selected state
    let filteredData = {
      x: [data.labels[userindex]],
      y: [data.values[userindex]]
    };

    // Update plot with filtered data
    console.log(filteredData)
    Plotly.restyle('plot', 'x', [filteredData.x]);
    Plotly.restyle('plot', 'y', [filteredData.y]);
  });
});

  // JSON USED FOR PLOT NO. 2

d3.json('http://127.0.0.1:5000/api2').then(d=>{
  let trace2 = [{
    labels: ['Total with Healthcare', 'Total without Healthcare'],
    values: [d.values_total_hc[0], d.values_total_no_hc[0]],
    type: 'pie'
}];

Plotly.newPlot('plot2', trace2);
});

 // JSON USED FOR PLOT NO. 3
d3.json('http://127.0.0.1:5000/api3').then(d => {
  let checkboxes = d3.select('#my-checkboxes');

  // Populate the checkboxes
  checkboxes.selectAll('label')
    .data(d.labels)
    .enter()
    .append('label')
    .attr('class', 'checkbox-container')
    .text(d => d)
    .append('input')
    .attr('type', 'checkbox')
    .attr('class', 'state-checkbox')
    .attr('value', d => d);

  let trace3 = [{
    x: d.labels,
    y: d.values_total_12_a_14_noa,
    type: 'bar',
    name: 'Population between 12 and 14 years not attending school',
    marker: {
      color: 'orange'
    }
  }, {
    x: d.labels,
    y: d.values_total_12_a_14,
    type: 'bar',
    name: 'Total population between 12 and 14 years',
    marker: {
      color: 'gray'
    }
  }];

  let layout = {
    title: 'Population by State (Ages 12-14)',
    barmode: 'stack'
  };

  Plotly.newPlot('plot3', trace3, layout);

  // Add event listener for checkboxes
  checkboxes.selectAll('.state-checkbox').on('change', function() {
    let selectedStates = checkboxes.selectAll('.state-checkbox:checked').nodes().map(node => node.value);
    let filteredData = {
      x: selectedStates,
      y: selectedStates.map(state => d.values_total_12_a_14_noa[d.labels.indexOf(state)])
    };

    // Update plot with filtered data
    console.log(filteredData);
    Plotly.restyle('plot3', 'x', [filteredData.x]);
    Plotly.restyle('plot3', 'y', [filteredData.y]);
  });
});