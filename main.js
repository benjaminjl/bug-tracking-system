var dataTable;

google.charts.load('current', {'packages':['corechart']});
//google.charts.setOnLoadCallback(drawChart);

function drawChart() {
	var data = google.visualization.arrayToDataTable([
		['Day', 'Low', 'Open', 'Close', 'High'],
		['Mon', 20, 28, 38, 45],
		['Tue', 31, 38, 55, 66],
		['Wed', 50, 55, 77, 80],
		['Thu', 77, 77, 66, 50],
		['Fri', 68, 66, 22, 15]
		// Treat first row as data as well.
	], false);
	
	var options = {
		legend:'none',
		candlestick: {
			fallingColor: { strokeWidth: 0, fill: '#a52714' }, // red
			risingColor: { strokeWidth: 0, fill: '#0f9d58' }   // green
		},
		series: {
			0: { color: '#000000' }
		}
	};

	var chart = new google.visualization.CandlestickChart(document.getElementById('chart_div'));

	chart.draw(dataTable, options);
}

// Reading a File

var tickData;

function readFile(evt) {	
	
	var file = evt.target.files[0];
	
	Papa.parse(file, {
	header: false,
	dynamicTyping: false,
	complete: function(results){
  	workWithData(results);
  }
})
};

function workWithData(results){
		
	var barNum = 0;
	var timeFrame = 30;
	var high = 0;
	var low = 0;
	
	tickData = results;
	
	// ------- Version 2------------
	// Add empty rows, then populate
	// -----------------------------
	dataTable = new google.visualization.DataTable();
	
	// Set Cols
	dataTable.addColumn('string', 'Date');	// 0
	dataTable.addColumn('number', 'Low');		// 1
	dataTable.addColumn('number', 'Open');	// 2
	dataTable.addColumn('number', 'Close');	// 3
	dataTable.addColumn('number', 'High');	// 4
	
	var currentMin;
	
	// Find num of bars based on timeframe
	for (var i = 1; i < tickData.data.length-1; i++){
		
		var tempArray1 = tickData.data[i][0].split(" ");
		var tempArray2 = tempArray1[1].split(":");
		
		if(currentMin == tempArray2[1]){ // New Minute
			
			if (tickData.data[i][2] < low){
				low = tickData.data[i][2];
				dataTable.setCell(barNum-1, 1, low);								// Low - Constantly updating Low until new bar
			}
			
			dataTable.setCell(barNum-1, 3, tickData.data[i][2]); 	// Close - Constantly updating Close until new bar
			
			if (tickData.data[i][2] > high){
				high = tickData.data[i][2];
				dataTable.setCell(barNum-1, 4, high);								// High - Constantly updating High until new bar
			}
			
		}
		else{
			
			currentMin = tempArray2[1];
			
			if (currentMin % timeFrame == 0){ // New Bar
				barNum += 1;
				dataTable.addRow();
				
				dataTable.setCell(barNum-1, 0, tickData.data[i][0].substring(0, 19)); // Date - Substring to drop the milliseconds
				
				low  = tickData.data[i][2];
				dataTable.setCell(barNum-1, 1, low);																	// Low - Initially set as same as Open
				
				dataTable.setCell(barNum-1, 2, tickData.data[i][2]); 									// Open
				
				high = tickData.data[i][2];
				dataTable.setCell(barNum-1, 4, high);																	// High - Initially set as same as Open
				
			}
		}
		
	}
	
	//console.log(dataTable)
	drawChart();
}