import {Component, OnInit} from '@angular/core';
import {UIChart} from "primeng/chart";

const annotation = {
  type: 'doughnutLabel',
  font: [{size: 48}, {size: 20}],
  color: ['indigo', 'grey'],
  backgroundColor: 'rgba(0, 0, 0, 0.1)',
  borderColor: 'black',
  borderWidth: 2,
  borderDash: [7, 7],
  spacing: 2
};


@Component({
  selector: 'app-time-tracking',
  imports: [
    UIChart
  ],
  templateUrl: './time-tracking.component.html',
  styleUrl: './time-tracking.component.scss'
})
export class TimeTrackingComponent implements OnInit {
  trackedTime = 6; // Tracked hours (dynamic value)
  targetTime = 8;  // Target hours for completion
  chartData: any;
  chartOptions: any;


  ngOnInit() {
    this.updateChart();
  }

  updateChart() {
    this.chartData = {
      datasets: [
        // Background dataset (normal working hours)
        // Overlay dataset (booked hours)
        {
          label: 'Booked Hours',
          data: [7.7, 1.7], // 6h booked, 1.7h remaining
          backgroundColor: ['#4CAF50', '#b0b0b0'], // Green booked, grey remaining
          hoverBackgroundColor: ['#388E3C', '#b0b0b0'], // Darker hover effect
          borderWidth: 5, // No borders
          borderColor: '#2B3240',
          borderRadius: 0, // Rounded corners
        },
        {
          label: 'Normal Time',
          data: [7.7], // 6h booked, 1.7h remaining
          backgroundColor: ['#4CAF50', '#b0b0b0'], // Green booked, grey remaining
          hoverBackgroundColor: ['#388E3C', '#b0b0b0'], // Darker hover effect
          borderWidth: 5, // No borders
          borderColor: '#2B3240',
          borderRadius: 0, // Rounded corners
        }
      ]
    };

    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      rotation: -90, // Starts from the bottom
      circumference: 180, // Makes it a half-circle
      cutout: '75%', // Hollow effect
      plugins: {
        legend: {
          position: 'bottom'
        },
        tooltip: {
          callbacks: {
            label: function (tooltipItem: any) {
              const dataset = tooltipItem.dataset;
              const dataIndex = tooltipItem.dataIndex;
              const value = dataset.data[dataIndex];
              if(dataset.label === 'Booked Hours') {
                if(dataIndex === 0) {
                  return `Booked hours: ${value}h`;
                } else {
                  if( dataset.data[0] > 7.7) {
                    return `Overtime: ${value}h`;
                  }
                  return `Open hours: ${value}h`;
                }
              }
              else {
                return `Value: ${value}h`;
              } // Custom tooltip format
            }
          }
        }
      }
    };
  }
}
