  
// Read in json file
d3.json("samples.json").then((importData) => {
    var data=importData;
    console.log(data);


    // Dynamically add test Subject ID No. to the dropdown menus
	var names = data.names;

	names.forEach((name) => {
		d3.select("#selDataset").append("option").text(name);
	})

    function buildPlots() {

        // Choose data for test ID No. 940 plotted as default
		defaultDataset = data.samples.filter(sample => sample.id === "940")[0];
		console.log(defaultDataset);


        // create the variables for data
       
        var allSampleValues=defaultDataset.sample_values
        var sampleValues=allSampleValues.slice(0,10).reverse();
        console.log(sampleValues);
        var allsampleLabels=defaultDataset.otu_labels;
        var sampleLabels=allsampleLabels.slice(0,10).reverse();
        console.log(sampleLabels);
        var allsampleOtuIds=defaultDataset.otu_ids;
        var sampleOtuIds=allsampleOtuIds.slice(0,10).reverse();
        console.log(sampleOtuIds);
        // set otu_id's format for the plot
        var otuIdPlot=sampleOtuIds.map(d => "OTU"+d)
        console.log(`OTU IDS:${otuIdPlot}`)

        // ***************************Bar Chart****************************
        // Create the Trace
        var trace1= {
        x:sampleValues,
        y:otuIdPlot,
        text:sampleOtuIds,
        type:"bar",
        orientation:"h"
        };
        // Create the data array for the plot

        var barData=[trace1];
        // Define the plot layout
        var layout={
        title:"Top 10 Bacteria Cultures Found",
        xaxis:{title:"otu_id"} ,
        yaxis:{title:"Sample Values"},
        margin:{
            l:100,
            r:100,
            t:100,
            b:100
        }
        }
        // Plot the chart to a div tag with id "bar-plot"

        Plotly.newPlot("bar",barData,layout)

        // **********************Bubble Plot*****************************

        // Create the Trace
         
        var trace2= {

            x:allsampleOtuIds,
            y:allSampleValues,
            mode:"markers",
            marker:{
                size:allSampleValues,
                color:sampleOtuIds
            },
            text:allsampleLabels
        };
        

         // Create the data array for the plot
        var bubbleData=[trace2];

        // Define the plot layout
        var layout1={
            title:"Patient OTU Counts",
            xaxis:{title: "OTU ID"},
            height:600,
            width:1200
        };

        // create the bubble plot
        Plotly.newPlot("bubble", bubbleData, layout1)

        // **********************Demographic Info**********************


        demoDefault = data.metadata.filter(sample => sample.id === 940)[0];
		console.log(demoDefault);

		// Display each key-value pair from the metadata JSON object
		Object.entries(demoDefault).forEach(
			([key, value]) => d3.select("#sample-metadata")
													.append("p").text(`${key.toUpperCase()}: ${value}`));

		// **********Advanced Challenge: Guage Chart****************

		// Get the washing frequency value for the default test ID
		var wshfreqDefault = demoDefault.wfreq;

		var gaugeData = [
			{
				domain: { x: [0, 1], y: [0, 1] },
				value: wshfreqDefault,
				title: {text: '<b>Belly Button Washing Frequency</b> <br> Scrubs per week'},
				type: "indicator",
				mode: "gauge+number",
				gauge: {
					axis: { range: [null, 9] },
					steps: [
						{ range: [0, 1], color: 'rgb(248, 243, 236)' },
						{ range: [1, 2], color: 'rgb(244, 241, 229)' },
						{ range: [2, 3], color: 'rgb(233, 230, 202)' },
						{ range: [3, 4], color: 'rgb(229, 231, 179)' },
						{ range: [4, 5], color: 'rgb(213, 228, 157)' },
						{ range: [5, 6], color: 'rgb(183, 204, 146)' },
						{ range: [6, 7], color: 'rgb(140, 191, 136)' },
						{ range: [7, 8], color: 'rgb(138, 187, 143)' },
						{ range: [8, 9], color: 'rgb(133, 180, 138)' },
					],
				}
			}
		];
		
		var gaugeLayout = { width: 600, height: 450, margin: { t: 0, b: 0 } };
		
		Plotly.newPlot('gauge', gaugeData, gaugeLayout);
    }
buildPlots();

	// Call updateBar() when a change takes place to the DOM
	d3.selectAll("#selDataset").on("change", updatePlots);

	// 2. Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual.
	// This function is called when a dropdown menu item is selected
	function updatePlots() {

		// Use D3 to select the dropdown menu
			var inputElement = d3.select("#selDataset");

		// Assign the value of the dropdown menu option to a variable
			var inputValue = inputElement.property("value");
			console.log(inputValue);

		// Filter the dataset based on inputValue ID
			dataset = data.samples.filter(sample => sample.id === inputValue)[0];
			console.log(dataset);

		// create the variables for data
       // var otuIds=defaultDataset.samples.otu_ids;
        //console.log(otuIds)
        var allSampleValues=dataset.sample_values
        var topValues=allSampleValues.slice(0,10).reverse();
        console.log(topValues);
        var allsampleLabels=dataset.otu_labels;
        var topLabels=allsampleLabels.slice(0,10).reverse();
        console.log(topLabels);
        var allsampleOtuIds=dataset.otu_ids;
        var topOtuIds=allsampleOtuIds.slice(0,10).reverse();
        console.log(topOtuIds);
        // set otu_id's format for the plot
        var otuIdPlot=topOtuIds.map(d => "OTU"+d)
        console.log(`OTU IDS:${otuIdPlot}`)
     
        // ******************Bar Chart****************************
		Plotly.restyle("bar", "x", [topValues]);
		Plotly.restyle("bar", "y", [otuIdPlot]);
		Plotly.restyle("bar", "text", [topLabels]);

		// *****************Bubble Chart***************************
		Plotly.restyle('bubble', "x", [allsampleOtuIds]);
		Plotly.restyle('bubble', "y", [allSampleValues]);
		Plotly.restyle('bubble', "text", [allsampleLabels]);
		Plotly.restyle('bubble', "marker.color", [allsampleOtuIds]);
		Plotly.restyle('bubble', "marker.size", [allSampleValues]);

		// *************** Demographic Info***********************
		metainfo = data.metadata.filter(sample => sample.id == inputValue)[0];

        // Clear out current contents in the panel
		d3.select("#sample-metadata").html("");
             
		// Display each key-value pair from the metadata JSON object
		Object.entries(metainfo).forEach(
			([key, value]) => d3.select("#sample-metadata").append("p").text(`${key.toUpperCase()}: ${value}`));     
               
        // **********Advanced Challenge: Guage Chart****************

		var wshfreq = metainfo.wfreq;

		Plotly.restyle('gauge', "value", wshfreq);
	
    }
});
