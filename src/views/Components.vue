<template>
    <div class="min-h-screen bg-gray-50">
      <!-- Header (reusing the same header from HomePage) -->
      <NavBar
      :isLoggedIn="isLoggedIn"
      :userName="userName"
      :userRole="userRole"
      :userInitials="userInitials"
      :isMobileMenuOpen="isMobileMenuOpen"
      :isProfileOpen="isProfileOpen"
      @show-login-modal="showLoginModal = true"
      @logout="logout"
    />
  
      <!-- Page Title and Search -->
      <div class="bg-white border-b">
        <div class="container mx-auto px-4 py-8">
          <h1 class="text-2xl font-bold text-gray-800 mb-6">All Components</h1>
          
          <!-- Search and Filters -->
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div class="relative w-full md:w-96">
              <input 
                type="text" 
                placeholder="Search components..." 
                class="pl-10 pr-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                v-model="searchQuery"
              />
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            <div class="flex flex-wrap gap-2">
              <select v-model="categoryFilter" class="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <option value="">All Categories</option>
                <option value="microcontroller">Microcontrollers</option>
                <option value="sensor">Sensors</option>
                <option value="display">Displays</option>
                <option value="passive">Passive Components</option>
                <option value="tool">Tools</option>
              </select>
              
              <select v-model="availabilityFilter" class="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <option value="">All Availability</option>
                <option value="available">Available</option>
                <option value="borrowed">Borrowed</option>
              </select>
              
              <select v-model="sortBy" class="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <option value="name">Sort by Name</option>
                <option value="stock">Sort by Stock</option>
                <option value="popularity">Sort by Popularity</option>
              </select>
            </div>
          </div>
          
          <!-- Stats -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div class="bg-gray-50 p-4 rounded-lg">
              <div class="text-sm text-gray-500">Total Components</div>
              <div class="text-2xl font-bold text-gray-800">{{ filteredComponents.length }}</div>
            </div>
            <div class="bg-gray-50 p-4 rounded-lg">
              <div class="text-sm text-gray-500">Available</div>
              <div class="text-2xl font-bold text-green-600">{{ availableCount }}</div>
            </div>
            <div class="bg-gray-50 p-4 rounded-lg">
              <div class="text-sm text-gray-500">Borrowed</div>
              <div class="text-2xl font-bold text-red-600">{{ borrowedCount }}</div>
            </div>
            <div class="bg-gray-50 p-4 rounded-lg">
              <div class="text-sm text-gray-500">Categories</div>
              <div class="text-2xl font-bold text-gray-800">{{ categoryCount }}</div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Components List -->
      <div class="container mx-auto px-4 py-8">
        <div v-if="filteredComponents.length === 0" class="text-center py-12">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 class="text-lg font-medium text-gray-700 mb-2">No components found</h3>
          <p class="text-gray-500">Try adjusting your search or filters to find what you're looking for.</p>
        </div>
        
        <!-- Grid View / List View Toggle -->
        <div class="flex justify-end mb-4">
          <div class="bg-white border rounded-md inline-flex">
            <button 
              @click="viewMode = 'grid'" 
              :class="`px-3 py-1.5 ${viewMode === 'grid' ? 'bg-emerald-50 text-emerald-600' : 'text-gray-600'}`"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button 
              @click="viewMode = 'list'" 
              :class="`px-3 py-1.5 ${viewMode === 'list' ? 'bg-emerald-50 text-emerald-600' : 'text-gray-600'}`"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
        
        <!-- Grid View -->
        <div v-if="viewMode === 'grid'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div 
            v-for="(component, index) in filteredComponents" 
            :key="index" 
            class="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition"
          >
            <div class="h-40 bg-gray-200 flex items-center justify-center">
              <img :src="component.image" :alt="component.name" class="max-h-full max-w-full object-contain" />
            </div>
            <div class="p-4">
              <div class="flex justify-between items-start">
                <h3 class="font-medium text-gray-800">{{ component.name }}</h3>
                <span :class="`px-2 py-1 text-xs rounded-full ${component.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`">
                  {{ component.available ? 'Available' : 'Borrowed' }}
                </span>
              </div>
              <div class="mt-1 text-xs text-gray-500">Category: {{ component.category || 'Uncategorized' }}</div>
              <p class="text-sm text-gray-600 mt-1">{{ component.description }}</p>
              <div class="mt-4 flex justify-between items-center">
                <span class="text-sm text-gray-500">Stock: {{ component.stock }}</span>
                <button 
                  :disabled="!component.available || !isLoggedIn" 
                  :class="`px-3 py-1 rounded text-sm ${component.available && isLoggedIn ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`"
                >
                  {{ isLoggedIn ? 'Borrow' : 'Login to Borrow' }}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- List View -->
        <div v-if="viewMode === 'list'" class="bg-white rounded-lg shadow overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Component</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(component, index) in filteredComponents" :key="index" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-md flex items-center justify-center overflow-hidden">
                      <img :src="component.image" :alt="component.name" class="max-h-full max-w-full object-contain" />
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ component.name }}</div>
                      <div class="text-sm text-gray-500 truncate max-w-xs">{{ component.description }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ component.category || 'Uncategorized' }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="`px-2 py-1 text-xs rounded-full ${component.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`">
                    {{ component.available ? 'Available' : 'Borrowed' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ component.stock }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    :disabled="!component.available || !isLoggedIn" 
                    :class="`px-3 py-1 rounded ${component.available && isLoggedIn ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`"
                  >
                    {{ isLoggedIn ? 'Borrow' : 'Login' }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Pagination -->
        <div class="mt-8 flex items-center justify-between">
          <div class="text-sm text-gray-700">
            Showing <span class="font-medium">1</span> to <span class="font-medium">{{ Math.min(filteredComponents.length, 20) }}</span> of <span class="font-medium">{{ filteredComponents.length }}</span> components
          </div>
          <div class="flex space-x-2">
            <button class="px-3 py-1 border rounded-md text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50" disabled>
              Previous
            </button>
            <button class="px-3 py-1 border rounded-md text-sm bg-emerald-50 text-emerald-600 font-medium">
              1
            </button>
            <button v-if="filteredComponents.length > 20" class="px-3 py-1 border rounded-md text-sm text-gray-600 hover:bg-gray-50">
              2
            </button>
            <button v-if="filteredComponents.length > 40" class="px-3 py-1 border rounded-md text-sm text-gray-600 hover:bg-gray-50">
              3
            </button>
            <button v-if="filteredComponents.length > 20" class="px-3 py-1 border rounded-md text-sm text-gray-600 hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </div>
  
      <!-- Login Modal (reused from HomePage) -->
      <div v-if="showLoginModal" class="fixed inset-0 bg-black/85 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-bold text-gray-800">Login</h3>
            <button @click="showLoginModal = false" class="text-gray-500 hover:text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="space-y-4">
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" id="email" v-model="loginForm.email" class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input type="password" id="password" v-model="loginForm.password" class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <input type="checkbox" id="remember" v-model="loginForm.remember" class="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded" />
                <label for="remember" class="ml-2 block text-sm text-gray-700">Remember me</label>
              </div>
              <a href="#" class="text-sm text-emerald-600 hover:text-emerald-500">Forgot password?</a>
            </div>
            <button @click="login" class="w-full bg-emerald-600 text-white py-2 rounded-md hover:bg-emerald-700 transition">Login</button>
          </div>
          <div class="mt-4 text-center text-sm text-gray-600">
            Don't have an account? <a href="#" class="text-emerald-600 hover:text-emerald-500">Register</a>
          </div>
        </div>
      </div>
  
      <!-- Footer (simplified from HomePage) -->
      <Footer />
    </div>
  </template>
  
  <script>
  import NavBar from '../components/NavBar.vue';
  import Footer from '../components/Footer.vue';

  export default {
    name: 'ComponentsList',
    components: {
      NavBar,
      Footer
    },
    
    data() {
      return {
        isLoggedIn: false,
        userName: 'John Doe',
        userRole: 'user', // 'user', 'manager', or 'admin'
        isMobileMenuOpen: false,
        isProfileOpen: false,
        showLoginModal: false,
        viewMode: 'grid', // 'grid' or 'list'
        
        // Filters
        searchQuery: '',
        categoryFilter: '',
        availabilityFilter: '',
        sortBy: 'name',
        
        loginForm: {
          email: '',
          password: '',
          remember: false
        },
        
        // Component data with added categories
        components: [
          {
            name: 'Arduino Uno',
            description: 'Microcontroller board based on the ATmega328P',
            image: 'https://via.placeholder.com/150?text=Arduino+Uno',
            available: true,
            stock: 15,
            category: 'microcontroller',
            popularity: 95
          },
          {
            name: 'Raspberry Pi 4',
            description: 'Single-board computer with 4GB RAM',
            image: 'https://via.placeholder.com/150?text=Raspberry+Pi',
            available: true,
            stock: 8,
            category: 'microcontroller',
            popularity: 90
          },
          {
            name: 'ESP32 Dev Board',
            description: 'Dual-core microcontroller with WiFi & Bluetooth',
            image: 'https://via.placeholder.com/150?text=ESP32',
            available: false,
            stock: 0,
            category: 'microcontroller',
            popularity: 85
          },
          {
            name: 'Ultrasonic Sensor',
            description: 'HC-SR04 distance measuring sensor',
            image: 'https://via.placeholder.com/150?text=Ultrasonic',
            available: true,
            stock: 20,
            category: 'sensor',
            popularity: 80
          },
          {
            name: 'Servo Motor',
            description: 'SG90 9g micro servo motor',
            image: 'https://via.placeholder.com/150?text=Servo',
            available: true,
            stock: 12,
            category: 'actuator',
            popularity: 75
          },
          {
            name: 'LED Kit',
            description: 'Assorted LEDs in different colors',
            image: 'https://via.placeholder.com/150?text=LED+Kit',
            available: true,
            stock: 30,
            category: 'passive',
            popularity: 70
          },
          {
            name: 'Breadboard',
            description: 'Solderless breadboard for prototyping',
            image: 'https://via.placeholder.com/150?text=Breadboard',
            available: true,
            stock: 25,
            category: 'tool',
            popularity: 85
          },
          {
            name: 'Resistor Kit',
            description: 'Various resistors for electronic circuits',
            image: 'https://via.placeholder.com/150?text=Resistors',
            available: true,
            stock: 50,
            category: 'passive',
            popularity: 65
          },
          {
            name: 'OLED Display',
            description: '0.96" I2C OLED display module',
            image: 'https://via.placeholder.com/150?text=OLED',
            available: true,
            stock: 10,
            category: 'display',
            popularity: 75
          },
          {
            name: 'DHT11 Sensor',
            description: 'Temperature and humidity sensor',
            image: 'https://via.placeholder.com/150?text=DHT11',
            available: true,
            stock: 15,
            category: 'sensor',
            popularity: 70
          },
          {
            name: 'Jumper Wires',
            description: 'Male to male, female to female, and male to female jumper wires',
            image: 'https://via.placeholder.com/150?text=Jumper+Wires',
            available: true,
            stock: 100,
            category: 'tool',
            popularity: 90
          },
          {
            name: 'Capacitor Kit',
            description: 'Various capacitors for electronic circuits',
            image: 'https://via.placeholder.com/150?text=Capacitors',
            available: true,
            stock: 40,
            category: 'passive',
            popularity: 60
          },
          {
            name: 'Potentiometer',
            description: '10K ohm variable resistor',
            image: 'https://via.placeholder.com/150?text=Potentiometer',
            available: false,
            stock: 0,
            category: 'passive',
            popularity: 65
          },
          {
            name: 'LCD Display',
            description: '16x2 character LCD display with I2C interface',
            image: 'https://via.placeholder.com/150?text=LCD',
            available: true,
            stock: 8,
            category: 'display',
            popularity: 70
          },
          {
            name: 'IR Sensor',
            description: 'Infrared obstacle avoidance sensor',
            image: 'https://via.placeholder.com/150?text=IR+Sensor',
            available: true,
            stock: 12,
            category: 'sensor',
            popularity: 65
          },
          {
            name: 'Soldering Iron',
            description: '60W adjustable temperature soldering iron',
            image: 'https://via.placeholder.com/150?text=Soldering+Iron',
            available: true,
            stock: 5,
            category: 'tool',
            popularity: 80
          },
          {
            name: 'NodeMCU',
            description: 'ESP8266-based development board with WiFi',
            image: 'https://via.placeholder.com/150?text=NodeMCU',
            available: true,
            stock: 10,
            category: 'microcontroller',
            popularity: 85
          },
          {
            name: 'Relay Module',
            description: '5V 4-channel relay module for Arduino',
            image: 'https://via.placeholder.com/150?text=Relay',
            available: true,
            stock: 8,
            category: 'actuator',
            popularity: 70
          }
        ]
      }
    },
    
    computed: {
      userInitials() {
        if (!this.userName) return ''
        return this.userName.split(' ').map(n => n[0]).join('').toUpperCase()
      },
      
      filteredComponents() {
        let result = [...this.components]
        
        // Apply search filter
        if (this.searchQuery) {
          const query = this.searchQuery.toLowerCase()
          result = result.filter(component => 
            component.name.toLowerCase().includes(query) || 
            component.description.toLowerCase().includes(query) ||
            (component.category && component.category.toLowerCase().includes(query))
          )
        }
        
        // Apply category filter
        if (this.categoryFilter) {
          result = result.filter(component => component.category === this.categoryFilter)
        }
        
        // Apply availability filter
        if (this.availabilityFilter === 'available') {
          result = result.filter(component => component.available)
        } else if (this.availabilityFilter === 'borrowed') {
          result = result.filter(component => !component.available)
        }
        
        // Apply sorting
        if (this.sortBy === 'name') {
          result.sort((a, b) => a.name.localeCompare(b.name))
        } else if (this.sortBy === 'stock') {
          result.sort((a, b) => b.stock - a.stock)
        } else if (this.sortBy === 'popularity') {
          result.sort((a, b) => b.popularity - a.popularity)
        }
        
        return result
      },
      
      availableCount() {
        return this.components.filter(c => c.available).length
      },
      
      borrowedCount() {
        return this.components.filter(c => !c.available).length
      },
      
      categoryCount() {
        const categories = new Set(this.components.map(c => c.category).filter(Boolean))
        return categories.size
      }
    },
    
    methods: {
      login() {
        // In a real app, you would validate credentials and make an API call
        if (this.loginForm.email && this.loginForm.password) {
          this.isLoggedIn = true
          
          // Simulate different user roles based on email
          if (this.loginForm.email.includes('admin')) {
            this.userRole = 'admin'
          } else if (this.loginForm.email.includes('manager')) {
            this.userRole = 'manager'
          } else {
            this.userRole = 'user'
          }
          
          this.showLoginModal = false
        }
      },
      
      logout() {
        this.isLoggedIn = false
        this.userRole = 'user'
        this.isProfileOpen = false
      }
    }
  }
  </script>
  
  <style scoped>
  .transition {
    transition: all 0.3s ease;
  }
  </style>