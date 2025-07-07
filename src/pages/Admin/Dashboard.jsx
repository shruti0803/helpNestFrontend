import React, { useState, useEffect } from 'react';
import { Line, Pie } from 'react-chartjs-2';
import { useRef } from 'react';
 import { FaClipboardList } from 'react-icons/fa'; // make sure this is imported at top
import {
  Chart as ChartJS,
  ArcElement,
  LineElement,
  PointElement,
  CategoryScale,
   BarElement, 
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';

ChartJS.register(ArcElement, LineElement, PointElement, CategoryScale,  BarElement,  LinearScale, Tooltip, Legend);
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';




const AdminDashboard = () => {
const barChartRef = useRef(null);
const barOptions = {
  responsive: true,
  animation: {
    duration: 1500,
    easing: 'easeOutBounce',
  },
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    x: {
      title: {
        display: true,
        text: 'Services',
      },
      grid: {
        display: false, // no vertical lines
      },
    },
    y: {
      display: false, // ❌ remove Y-axis completely
      grid: {
        display: false, // no background lines
      },
      ticks: {
        display: false, // remove numbers
      },
    },
  },
};

  //new

  



  const [monthlyProfit, setMonthlyProfit] = useState(0);
const [monthlyProfitTrend, setMonthlyProfitTrend] = useState({
  labels: [],
  datasets: [],
});

  // State for selecting month and year
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth()); // 0 for January, 11 for December
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
 
  

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth()+1; // Month is zero-based (0-11), so add 1
  const currentYear = currentDate.getFullYear();

  const [newCustomers, setNewCustomers] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [newHelpers, setNewHelpers] = useState(0);
  const [totalHelpers, setTotalHelpers] = useState(0);

  const [dailyRevenueData, setDailyRevenueData] = useState({
   labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5']
,
    datasets: []
  });


  

const [ratingStats, setRatingStats] = useState(null);

useEffect(() => {
  const fetchRatingStats = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/ratings-summary');
      setRatingStats(res.data);
    } catch (err) {
      console.error("Failed to fetch rating stats", err);
    }
  };
  fetchRatingStats();
}, []);

 

 //new for booking
useEffect(() => {
  const fetchBookingPerDate = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/bookings-by-date', {
        params: {
          month: selectedMonth + 1,
          year: selectedYear
        }
      });

      const data = response.data;

      // Map the backend result into a dictionary for quick access
      const bookingMap = {};
      data.forEach(item => {
        const date = new Date(item._id).getDate(); // only get day
        bookingMap[date] = item.count;
      });

      const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
      const labels = [];
      const counts = [];
     const today = new Date();
const isCurrentMonth = selectedMonth === today.getMonth() && selectedYear === today.getFullYear();
const limitDay = isCurrentMonth ? today.getDate() : daysInMonth;

for (let day = 1; day <= limitDay; day++) {
  labels.push(day.toString());
  counts.push(bookingMap[day] || 0);
}


      setDailyRevenueData({
        labels,
        datasets: [{
          label: 'Bookings per Day',
          data: counts,
          borderColor: 'green',
          backgroundColor: 'rgba(0, 128, 0, 0.1)',
          fill: false,
          tension: 0.4,
          borderWidth: 2,
          pointRadius: 4,
          pointBackgroundColor: 'green',
        }]
      });
    } catch (error) {
      console.error('Error fetching booking trend:', error);
      setDailyRevenueData({ labels: [], datasets: [] });
    }
  };

  fetchBookingPerDate();
}, [selectedMonth, selectedYear]);


  

 const RevenueChartOptions = {
  responsive: true,
  scales: {
    x: {
      title: {
        display: true,
        text: 'Days of the Month',
      },
      grid: {
        display: false,
      },
      ticks: {
        autoSkip: true,
        maxTicksLimit: 10,
      },
    },
    y: {
      title: {
        display: true,
        text: 'Bookings Count',
      },
      beginAtZero: true,
      ticks: {
        callback: function (value) {
          return `${value.toLocaleString()} bookings`;
        },
      },
    },
  },
  plugins: {
    legend: {
      display: true,
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          return `${context.raw.toLocaleString()} bookings`;
        },
      },
    },
  },
};



  // Data for a smooth mountain-like curve
const [waveData, setWaveData] = useState({
  labels: ['1'], // just a placeholder
  datasets: [],
});


  // Chart options for the curve
  const chartOptions = {
    responsive: true,
    scales: {
      x: {
        display: false, // Hide x-axis
      },
      y: {
        display: false, // Hide y-axis
      },
    },
    plugins: {
      legend: {
        display: false, // Hide legend
      },
      tooltip: {
        enabled: false, // Disable tooltips
      },
    },
  };

 

 
  

  // Data for Pie Charts
 useEffect(() => {
  // Fetch new and total customers
  axios.get('http://localhost:5000/api/admin/users/summary')
    .then(response => {
      setNewCustomers(response.data.newUsersLastWeek || 0);
      setTotalCustomers(response.data.totalUsers || 0);
    })
    .catch(error => console.error('Error fetching user summary:', error));

  // Fetch new and total helpers
  axios.get('http://localhost:5000/api/admin/helpers/summary')
    .then(response => {
      setNewHelpers(response.data.newHelpersLastWeek || 0);
      setTotalHelpers(response.data.totalHelpers || 0);
    })
    .catch(error => console.error('Error fetching helper summary:', error));
}, []);

 
  

  // Prepare data for charts
  const newCustomersData = {
    labels: ['Existing Users', 'New Users'],
    datasets: [
      {
        data: [totalCustomers - newCustomers, newCustomers],
        backgroundColor: ['#36A2EB', '#FF6384'],
        hoverBackgroundColor: ['#36A2EB', '#FF6384'],
      },
    ],
  };

  const newHelpersData = {
    labels: ['Existing Helpers', 'Helpers'],
    datasets: [
      {
        data: [totalHelpers - newHelpers, newHelpers],
        backgroundColor: ['#FFCE56', '#4BC0C0'],
        hoverBackgroundColor: ['#FFCE56', '#4BC0C0'],
      },
    ],
  };
  const monthOptions = Array.from({ length: 12 }, (_, i) => (
    <option key={i} value={i}>
      {new Date(0, i).toLocaleString('default', { month: 'long' })}
    </option>
  ));

  // const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 10 }, (_, i) => (
    <option key={currentYear - i} value={currentYear - i}>
      {currentYear - i}
    </option>
  ));


  const serviceLabels = [
  "Tech Support",
  "Medical Assistance",
  "Companionship",
  "Disability Support",
  "Errand Services",
  "Childcare"
];

const [servicesData, setServicesData] = useState({
  labels: serviceLabels,
  datasets: [
    {
      label: "Requests Booked",
      data: new Array(serviceLabels.length).fill(0),
      backgroundColor: '	#2e2e2e', // Light purple for all bars
      hoverBackgroundColor: '#7e22ce', // Dark purple on hover
      borderRadius: 14,               // More rounded bars
      barThickness: 24,               // Slim but visible
      borderSkipped: false,          // All corners rounded
    },
  ],
});




// useEffect(() => {
//   const chart = barChartRef.current;
//   if (!chart) return;

//   const ctx = chart.ctx;
//   const gradient = ctx.createLinearGradient(0, 0, 0, 300);
//   gradient.addColorStop(0, '#a855f7');
//   gradient.addColorStop(1, '#9333ea');

//   chart.data.datasets[0].backgroundColor = gradient;
//   chart.update();
// }, [servicesData]);

  
  useEffect(() => {
  const fetchBookingCounts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/bookings-by-category');
      const apiData = response.data; // [{ Service_Name: "Tech Support", booking_count: 12 }, ...]

      const updatedData = serviceLabels.map(label => {
        const match = apiData.find(item => item.Service_Name === label);
        return match ? match.booking_count : 0;
      });

      setServicesData(prev => ({
        ...prev,
        datasets: [
          {
            ...prev.datasets[0],
            data: updatedData,
          },
        ],
      }));
    } catch (error) {
      console.error('Error fetching booking counts:', error);
    }
  };

  fetchBookingCounts();
}, []);




      // new addying 
      useEffect(() => {
  const fetchMonthlyProfit = async () => {
    const month = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}`;

    try {
      const res = await axios.get(`http://localhost:5000/api/admin/earnings/${month}`);
 const profit = res.data?.profit || 0;
setMonthlyProfit(profit);
// Simulate 5-point mountain-like curve using the profit value
const simulatedData = [
  0.2 * profit,  // slow start
  0.6 * profit,  // sharp rise
  0.8 * profit,  // near peak
  0.6 * profit,  // slight dip
  1.0 * profit,  // final peak
];

setWaveData({
  labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
  datasets: [
    {
      label: 'Profit Earned (₹)',
      data: simulatedData,
      borderColor: 'white',
      borderWidth: 2,
      tension: 0.4,
      pointRadius: 0,
      fill: true,
      backgroundColor: 'rgba(0, 128, 0, 0.3)',
    },
  ],
});

    } catch (err) {
      console.error('Error fetching profit for graph:', err);
      setWaveData({
        labels: ['1'],
        datasets: [
          {
            label: 'Profit Earned (₹)',
            data: [0],
            borderColor: 'gray',
            borderWidth: 2,
            tension: 0.4,
            pointRadius: 0,
            fill: true,
            backgroundColor: 'rgba(128, 128, 128, 0.3)',
          },
        ],
      });
    }
  };

  fetchMonthlyProfit();
}, [selectedMonth, selectedYear]);





    const cityCoordinates = {
      'Delhi': [28.6139, 77.2090],
      'Faridabad': [28.4089, 77.3178],
      'Ludhiana': [30.9008, 75.8573],
      'Ghaziabad': [28.6688, 77.4538],
      'Kanpur': [26.4478, 80.3467],
      'Varanasi': [25.3176, 82.9739],
      'Lucknow': [26.8467, 80.9462],
      'Meerut': [28.9845, 77.7064],
      'Agra': [27.1767, 78.0081],
      'Jaipur': [26.9124, 75.7873],
      'Rajkot': [22.3072, 70.7969],
      'Ahmedabad': [23.0225, 72.5714],
      'Vadodara': [22.3072, 73.1812],
      'Surat': [21.1702, 72.8311],
      'Mumbai': [19.0760, 72.8777],
      'Thane': [19.2183, 72.9781],
      'Vasai-Virar': [19.3854, 73.0645],
      'Pune': [18.5196, 73.8554],
      'Pimpri-Chinchwad': [18.6287, 73.8003],
      'Kalyan-Dombivli': [19.2183, 73.1261],
      'Nashik': [20.0113, 73.7898],
      'Nagpur': [21.1458, 79.0882],
      'Indore': [22.7196, 75.8577],
      'Bhopal': [23.2599, 77.4126],
      'Chhindwara': [22.0579, 78.9334],
      'Hyderabad': [17.385044, 78.486671],
      'Visakhapatnam': [17.6868, 83.2185],
      'Bangalore': [12.9716, 77.5946],
      'Chennai': [13.0827, 80.2707],
      'Kolkata': [22.5726, 88.3639],
      'Patna': [25.5941, 85.1376],
      'Ranchi': [23.3441, 85.3096],
    };
    
  

    const [cityBookingsData, setCityBookingsData] = useState([]);

  useEffect(() => {
    const fetchCityBookingsData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/bookings-by-city');
        const data = response.data;
console.log('City Bookings Data:', data);

        // Map the API response to include coordinates and booking counts
      const updatedCityBookingsData = data.map(item => ({
  city: item.city,
  bookings: item.count,
  coordinates: cityCoordinates[item.city] || [20.5937, 78.9629],
}));

console.log('Updated City Booking Markers:', updatedCityBookingsData);

        setCityBookingsData(updatedCityBookingsData);
      } catch (error) {
        console.error('Error fetching city bookings data:', error);
      }
    };

    fetchCityBookingsData();
  }, []); 

  return (
    <div className=" w-full bg-gray-100 p-4">
      {/* Row with three equal-sized cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2  h-80">
        {/* Sales Obtained */}
        <div className="bg-purple-300 p-4 rounded-xl shadow-lg flex flex-col justify-center">
  <h2 className="text-xl font-semibold mb-12">Requests Booked</h2>
  <div className=" w-full  px-2">
    <Bar ref={barChartRef} data={servicesData} options={{
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function (context) {
              return `${context.raw} bookings`;
            },
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: "#4B5563",
            font: { size: 8, weight: "200" },
          },
          grid: { display: false },
        },
        y: {
          display: false,
          grid: { display: false },
          ticks: { display: false },
        },
      },
    }} />
  </div>
</div>


<div className="bg-white p-4 rounded-xl shadow-lg flex flex-col justify-center">
  <h2 className="text-2xl font-semibold mb-8 pb-8">Overall Ratings</h2>

  {ratingStats ? (
    <div className="flex flex-col md:flex-row items-center justify-between">
      {/* Circle with average */}
      <div className="relative w-32 h-32 flex-shrink-0">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            className="text-gray-300"
            strokeWidth="10"
            stroke="currentColor"
            fill="transparent"
            r="50"
            cx="64"
            cy="64"
          />
          <circle
            className="text-purple-700"
            strokeWidth="10"
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r="50"
            cx="64"
            cy="64"
            strokeDasharray={`${ratingStats.averageRating * 62.8}, 314`} // 2πr = 314
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-700">{ratingStats.averageRating}</div>
            <div className="text-sm text-gray-600">Avg Rating</div>
          </div>
        </div>
      </div>

      {/* Rating breakdown */}
      <div className="flex flex-col gap-1 mt-4 md:mt-0 md:ml-6 w-full">
        {[5, 4, 3, 2, 1].map(star => {
          const total = ratingStats.totalRatings || 1;
          const count = ratingStats.ratingBreakdown[star] || 0;
          const percent = ((count / total) * 100).toFixed(1);
          return (
            <div key={star} className="flex items-center gap-2">
              <span className="text-sm font-medium w-6">{star}★</span>
              <div className="w-full bg-gray-200 h-3 rounded overflow-hidden">
                <div
                  className="bg-purple-700 h-full rounded"
                  style={{ width: `${percent}%` }}
                />
              </div>
              {/* <span className="text-sm text-gray-600 ml-2">{count}</span> */}
            </div>
          );
        })}
      </div>
    </div>
  ) : (
    <p>Loading rating stats...</p>
  )}
</div>


        {/* New Customers */}
        <div className="bg-white p-4 rounded-lg shadow-lg flex flex-col justify-center">
          <h2 className="text-2xl font-semibold mb-8">Users Analytics </h2>
          <div className="mt-4 flex items-center justify-between">
            {/* Pie Chart */}
            <div className="w-40 h-40">
              <Pie data={newCustomersData} options={{ responsive: true }} />
            </div>
            {/* Stats */}
            <div className="ml-6">
              <div className="mb-4">
                <p className="font-semibold">New Users</p>
                <p className="text-green-500 font-bold">{newCustomers}</p>
              </div>
              <div>
                <p className="font-semibold">Total Users</p>
                <p className="text-blue-500 font-bold">{totalCustomers}</p>
              </div>
            </div>
          </div>
        </div>

        
 

       
      </div>

      {/* Revenue Generated Card with month and year selector */}
      <div className="p-6 rounded-lg shadow-lg mt-6">
        <div className="flex justify-between items-center mb-4">
         <div>
  <h2 className="text-2xl font-semibold">Total Bookings</h2>




<p className="text-3xl font-bold text-green-800 flex items-center gap-2">
  <FaClipboardList className="text-4xl text-green-700" />
  {dailyRevenueData?.datasets?.[0]?.data?.reduce((acc, val) => acc + val, 0) || 0}
</p>

</div>

          <div>
            <label className="mr-2">Month:</label>
            <select value={selectedMonth} onChange={(e) => setSelectedMonth(Number(e.target.value))} className="p-2 border rounded">
              {monthOptions}
            </select>
            <label className="ml-4 mr-2">Year:</label>
            <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))} className="p-2 border rounded">
              {yearOptions}
            </select>
          </div>
        </div>
        <div className="mt-4" style={{ width: '100%', height: '400px' }}>
          <Line data={dailyRevenueData} options={RevenueChartOptions} />
        </div>
      </div>
      {/* Services Booked and geography graph  */}
      <div className='flex flex-col md:flex-row justify-center gap-4'>

 <div className="bg-purple-500 text-black mt-6 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold">Net Profit</h2>
          <p>Total Profit for <strong>{monthNames[currentMonth - 1]}</strong></p>
          <p className="text-3xl font-bold text-white mt-3">
         ₹{monthlyProfit.toLocaleString()}

          </p>
         
          <div className="mt-4">
            <div className="w-full text-white ">
              <Line data={waveData} options={chartOptions} height={150} width={300} />
            </div>
          </div>
        </div>
 <div className="bg-white mt-6 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold">Helpers Analytics </h2>
          <div className="mt-4 flex items-center justify-between">
            
            <div className="w-40 h-40">
              <Pie data={newHelpersData} options={{ responsive: true }} />
            </div>
          
            <div className="ml-6">
              <div className="mb-4">
                <p className="font-semibold">New Helpers</p>
                <p className="text-green-500 font-bold">{newHelpers}</p>
              </div>
              <div>
                <p className="font-semibold">Total Helpers</p>
                <p className="text-blue-500 font-bold">{totalHelpers}</p>
              </div>
            </div>
          </div>
        </div>
  {/* Geography Chart (India map) with city markers */}
  <div className="bg-white mx-4 p-6 rounded-lg shadow-lg mt-6 md:w-1/2">
      <h2 className="text-2xl font-semibold">Bookings by City</h2>
      <div className="mt-4" style={{ height: '300px' }}>
        <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ width: '100%', height: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {cityBookingsData.map((cityData, index) => (
            <Marker
              key={index}
              position={cityData.coordinates}
              icon={L.divIcon({
                className: 'custom-icon',
                html: `<div style="background-color: #3388ff; color: white; padding: 5px; border-radius: 5px;">${cityData.bookings}</div>`,
                iconSize: [30, 30],
                iconAnchor: [15, 15],
              })}
            >
              <Popup>
                <h3>{cityData.city}</h3>
                <p>Bookings: {cityData.bookings}</p>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
</div>

         
          
      
    </div>
  );
};

export default AdminDashboard;