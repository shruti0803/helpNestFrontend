import React, { useState, useEffect } from 'react';
import { Line, Pie } from 'react-chartjs-2';
 import { FaClipboardList } from 'react-icons/fa'; // make sure this is imported at top
import {
  Chart as ChartJS,
  ArcElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';


ChartJS.register(ArcElement, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

const AdminDashboard = () => {
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
  const [newServiceProviders, setNewServiceProviders] = useState(0);
  const [totalServiceProviders, setTotalServiceProviders] = useState(0);

  const [dailyRevenueData, setDailyRevenueData] = useState({
   labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5']
,
    datasets: []
  });


  


 

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

      // Sort data to ensure proper x-axis order
      const sorted = data.sort((a, b) => new Date(a._id) - new Date(b._id));

      const labels = sorted.map(item => {
        const date = new Date(item._id);
        return `${date.getDate()}`; // Optional: you can return full label like `${date.getDate()} ${monthNames[date.getMonth()]}`
      });

      const counts = sorted.map(item => item.count);

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
      setNewServiceProviders(response.data.newHelpersLastWeek || 0);
      setTotalServiceProviders(response.data.totalHelpers || 0);
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

  const newServiceProvidersData = {
    labels: ['Existing Helpers', 'Helpers'],
    datasets: [
      {
        data: [totalServiceProviders - newServiceProviders, newServiceProviders],
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


    const [servicesData, setServicesData] = useState({
      labels: [
        'Childcare', 'Errand', 'Tech'
        
      ],
      datasets: [
        {
          data: new Array(11).fill(0), // Initialize with zeros
          backgroundColor: [
            '#FF6384', '#36A2EB', '#FFCE56', '#FF5733', '#C70039', '#900C3F',
            '#581845', '#DAF7A6', '#FFC300', '#FF6F61', '#FAD02E'
          ],
          hoverBackgroundColor: [
            '#FF6384', '#36A2EB', '#FFCE56', '#FF5733', '#C70039', '#900C3F',
            '#581845', '#DAF7A6', '#FFC300', '#FF6F61', '#FAD02E'
          ],
        },
      ],
    });
  
    useEffect(() => {
      const fetchBookingCounts = async () => {
        try {
          const response = await axios.get('http://localhost:4002/booking-count-by-service');
          const apiData = response.data;
          const data = servicesData.labels.map((label, index) => {
            const service = apiData.find((item) => item.Service_Name === label);
            return service ? service.booking_count : 0;
          });
  
          // Update the servicesData state
          setServicesData({
            ...servicesData,
            datasets: [
              {
                ...servicesData.datasets[0],
                data, // Set the updated data
              },
            ],
          });
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


//new  


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
        const response = await axios.get('http://localhost:4002/booking-count-by-city');
        const data = response.data;

        // Map the API response to include coordinates and booking counts
        const updatedCityBookingsData = data.map(item => ({
          city: item.Book_City,
          bookings: item.booking_count,
          coordinates: cityCoordinates[item.Book_City] || [20.5937, 78.9629], // Default to India center if not found
        }));

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sales Obtained */}
        <div className="bg-purple-500 text-black p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold">Net Profit</h2>
          <p>Total Profit for <strong>{monthNames[currentMonth - 1]}</strong></p>
          <p className="text-3xl font-bold text-white mt-3">
         ₹{monthlyProfit.toLocaleString()}

          </p>
          {/* Line Chart with custom mountain-like curve */}
          <div className="mt-4">
            <div className="w-full text-white h-40">
              <Line data={waveData} options={chartOptions} height={150} width={300} />
            </div>
          </div>
        </div>

        {/* New Customers */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold">Customers Analytics for <strong>{monthNames[currentMonth - 1]}</strong></h2>
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

        {/* New Service Providers */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold">Helpers Analytics for <strong>{monthNames[currentMonth - 1]}</strong></h2>
          <div className="mt-4 flex items-center justify-between">
            {/* Pie Chart */}
            <div className="w-40 h-40">
              <Pie data={newServiceProvidersData} options={{ responsive: true }} />
            </div>
            {/* Stats */}
            <div className="ml-6">
              <div className="mb-4">
                <p className="font-semibold">New Helpers</p>
                <p className="text-green-500 font-bold">{newServiceProviders}</p>
              </div>
              <div>
                <p className="font-semibold">Total Helpers</p>
                <p className="text-blue-500 font-bold">{totalServiceProviders}</p>
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
      <div className='flex flex-col md:flex-row'>
  {/* <div className="bg-white p-6 rounded-lg shadow-lg mt-6 md:w-1/2">
    <h2 className="text-2xl font-semibold">Services Booked</h2>
    <div className="mt-4 flex justify-center">
      <div className="w-80 h-80">
        <Pie data={servicesData} options={{ responsive: true }} />
      </div>
    </div>
  </div> */}

  {/* Geography Chart (India map) with city markers */}
  {/* <div className="bg-white mx-4 p-6 rounded-lg shadow-lg mt-6 md:w-1/2">
      <h2 className="text-2xl font-semibold">Bookings by City</h2>
      <div className="mt-4" style={{ height: '400px' }}>
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
    </div> */}
</div>

    </div>
  );
};

export default AdminDashboard;