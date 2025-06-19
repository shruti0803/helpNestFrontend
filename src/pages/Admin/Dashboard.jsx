import React, { useState, useEffect } from 'react';
import { Line, Pie } from 'react-chartjs-2';
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
  // State for selecting month and year
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth()); // 0 for January, 11 for December
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [totalSales, setTotalSales] = useState(null);
  const [totalRevenue,setTotalRevenue]=useState(null);

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
    labels: [],
    datasets: []
  });
  useEffect(() => {
    const fetchTotalSales = async () => {
      try {
        // Get current month and year
        

        // Make the API call with current month and year
        const response = await axios.get(`http://localhost:4002/sales?month=${currentMonth}&year=${currentYear}`);

        setTotalSales(response.data.totalSales);
        // console.log("totalSales", totalSales);
      } catch (error) {
        console.error('Error fetching sales data:', error);
      }
    };

    fetchTotalSales();
  }, []);

  // Generate data for the selected month dynamically
  useEffect(() => {
    const fetchTotalSales = async () => {
      try {
        const response = await axios.get(`http://localhost:4002/sales?month=${currentMonth}&year=${currentYear}`);
        setTotalSales(response.data.totalSales);
      } catch (error) {
        console.error('Error fetching sales data:', error);
      }
    };
    fetchTotalSales();
  }, [currentMonth, currentYear]);

  useEffect(() => {
    const fetchTotalRevenue = async () => {
      try {
        const response = await axios.get(`http://localhost:4002/total-cost`);
        setTotalRevenue(response.data.totalCost);
      } catch (error) {
        console.error('Error fetching sales data:', error);
      }
    };
    fetchTotalRevenue();
  }, []);

  // Fetch revenue data
  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        const response = await axios.get('http://localhost:4002/revenue-data', {
          params: { month: selectedMonth + 1, year: selectedYear },
        });
  
        if (response.data && response.data.length > 0) {
          // Map over the response data to extract only the day part of the date
          const labels = response.data.map(item => {
            const date = new Date(item.date);
            return date.getDate(); // Extracts only the day part of the date
          });
          const data = response.data.map(item => item.revenue);
  
          setDailyRevenueData({
            labels,
            datasets: [{
              label: 'Money Obtained (₹)',
              data,
              borderColor: 'green',
              backgroundColor: 'rgba(0, 128, 0, 0.1)',
              fill: false,
              tension: 0.4,
              borderWidth: 2,
              pointRadius: 4,
              pointBackgroundColor: 'green',
            }]
          });
        } else {
          setDailyRevenueData({ labels: [], datasets: [] });
        }
      } catch (error) {
        console.error('Error fetching revenue data:', error);
      }
    };
    fetchRevenueData();
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
          maxTicksLimit: 10, // Adjust this value for more/less spacing
        },
      },
      y: {
        title: {
          display: true,
          text: 'Money Obtained (₹)',
        },
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return `₹ ${value.toLocaleString()}`; // Format the y-axis label as rupees
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
            return `₹ ${context.raw.toLocaleString()}`; // Format tooltip data as rupees
          },
        },
      },
    },
  };


  // Data for a smooth mountain-like curve
  const waveData = {
    labels: ['1', '2', '3', '4', '5'], // Example x-axis labels
    datasets: [
      {
        label: 'Mountain Curve',
        data: [0, 1, 0.5, 1.5, 1], // Adjusted data points for a peak and trough shape
        borderColor: 'green',
        borderWidth: 2,
        tension: 0.4, // Smooth curve
        pointRadius: 0, // No points on the curve
        fill: true, // Fill area under the curve
        backgroundColor: 'rgba(0, 128, 0, 0.3)', // Light green with transparency for the shadow area
      },
    ],
  };

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

  // Data for Line Chart (Sales Obtained)
  const salesData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'], // Example labels
    datasets: [
      {
        label: 'Sales Obtained',
        data: [10000, 12000, 15000, 20000], // Example data points
        borderColor: 'green',
        backgroundColor: 'rgba(0, 128, 0, 0.1)',
        fill: true,
        tension: 0.4, // Smooth line
        borderWidth: 2,
      },
    ],
  };

  // Line Chart options
  const salesOptions = {
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
    },
  };

  // Data for Pie Charts
 useEffect(() => {
    // Fetch new customers data
    axios.get('http://localhost:4002/new-customers-and-sps?month=12&year=2024&isSP=0')
      .then(response => {
        // console.log("response new customer",response);
        setNewCustomers(response.data.totalCount); // Assuming response.data is the number of new customers
      })
      .catch(error => console.error('Error fetching new customers:', error));

    // Fetch new service providers data
    axios.get('http://localhost:4002/new-customers-and-sps?month=12&year=2024&isSP=1')
      .then(response => {
        // console.log("response new sp",response);
        
        setNewServiceProviders(response.data.totalCount); // Assuming response.data is the number of new service providers
      })
      .catch(error => console.error('Error fetching new service providers:', error));

    // Fetch total customers data
    axios.get('http://localhost:4002/total-customers-and-sps?isSP=0')
      .then(response => {
        setTotalCustomers(response.data.totalCount); // Assuming response.data is the total number of customers
      })
      .catch(error => console.error('Error fetching total customers:', error));

    // Fetch total service providers data
    axios.get('http://localhost:4002/total-customers-and-sps?isSP=1')
      .then(response => {
        // console.log("response",response);
        
        setTotalServiceProviders(response.data.totalCount); // Assuming response.data is the total number of service providers
      })
      .catch(error => console.error('Error fetching total service providers:', error));
  }, []);
  // console.log("new customer data",newCustomers);
  // console.log("new sp data",newServiceProviders);
  // console.log("total customer data",totalCustomers);
  // console.log("total sp data",totalServiceProviders);
  

  // Prepare data for charts
  const newCustomersData = {
    labels: ['Existing Customers', 'New Customers'],
    datasets: [
      {
        data: [totalCustomers - newCustomers, newCustomers],
        backgroundColor: ['#36A2EB', '#FF6384'],
        hoverBackgroundColor: ['#36A2EB', '#FF6384'],
      },
    ],
  };

  const newServiceProvidersData = {
    labels: ['Existing Providers', 'New Providers'],
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
          <h2 className="text-2xl font-semibold">Sales Obtained</h2>
          <p>Total Sales for <strong>{monthNames[currentMonth - 1]}</strong></p>
          <p className="text-3xl font-bold text-white mt-3">
          ₹{totalSales !== null ?totalSales.toLocaleString() : '0'}
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
                <p className="font-semibold">New Customers</p>
                <p className="text-green-500 font-bold">{newCustomers}</p>
              </div>
              <div>
                <p className="font-semibold">Total Customers</p>
                <p className="text-blue-500 font-bold">{totalCustomers}</p>
              </div>
            </div>
          </div>
        </div>

        {/* New Service Providers */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold">Service Providers Analytics for <strong>{monthNames[currentMonth - 1]}</strong></h2>
          <div className="mt-4 flex items-center justify-between">
            {/* Pie Chart */}
            <div className="w-40 h-40">
              <Pie data={newServiceProvidersData} options={{ responsive: true }} />
            </div>
            {/* Stats */}
            <div className="ml-6">
              <div className="mb-4">
                <p className="font-semibold">New Providers</p>
                <p className="text-green-500 font-bold">{newServiceProviders}</p>
              </div>
              <div>
                <p className="font-semibold">Total Providers</p>
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
            <h2 className="text-2xl font-semibold">Revenue Generated</h2>
            <p className="text-3xl font-bold text-green-800">
            ₹{totalRevenue !== null ?totalRevenue.toLocaleString() : '0'}
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
  <div className="bg-white p-6 rounded-lg shadow-lg mt-6 md:w-1/2">
    <h2 className="text-2xl font-semibold">Services Booked</h2>
    <div className="mt-4 flex justify-center">
      <div className="w-80 h-80">
        <Pie data={servicesData} options={{ responsive: true }} />
      </div>
    </div>
  </div>

  {/* Geography Chart (India map) with city markers */}
  <div className="bg-white mx-4 p-6 rounded-lg shadow-lg mt-6 md:w-1/2">
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
    </div>
</div>

    </div>
  );
};

export default AdminDashboard;