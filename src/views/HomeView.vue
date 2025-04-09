<template>
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
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
      <!-- Hero Section -->
      <section class="bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-16">
        <div class="container mx-auto px-4">
          <div class="max-w-3xl mx-auto text-center">
            <h2 class="text-3xl md:text-4xl font-bold mb-4">Component Management System</h2>
            <p class="text-lg mb-8">Borrow electronic components, return them when you're done, and track your projects - all in one place.</p>
            <div class="flex flex-col sm:flex-row justify-center gap-4">
              <button class="px-6 py-3 bg-white text-emerald-600 rounded-md font-medium hover:bg-gray-100 transition">
                Browse Components
              </button>
              <button v-if="!isLoggedIn" @click="showLoginModal = true" class="px-6 py-3 bg-emerald-700 text-white rounded-md font-medium hover:bg-emerald-800 transition">
                Get Started
              </button>
              <button v-else class="px-6 py-3 bg-emerald-700 text-white rounded-md font-medium hover:bg-emerald-800 transition">
                My Dashboard
              </button>
            </div>
          </div>
        </div>
      </section>
  
      <!-- Stats Section -->
      <section class="py-12 bg-white">
        <div class="container mx-auto px-4">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="bg-gray-50 p-6 rounded-lg text-center">
              <div class="text-3xl font-bold text-emerald-600 mb-2">{{ stats.totalComponents }}</div>
              <div class="text-gray-600">Total Components</div>
            </div>
            <div class="bg-gray-50 p-6 rounded-lg text-center">
              <div class="text-3xl font-bold text-emerald-600 mb-2">{{ stats.availableComponents }}</div>
              <div class="text-gray-600">Available Now</div>
            </div>
            <div class="bg-gray-50 p-6 rounded-lg text-center">
              <div class="text-3xl font-bold text-emerald-600 mb-2">{{ stats.activeUsers }}</div>
              <div class="text-gray-600">Active Users</div>
            </div>
          </div>
        </div>
      </section>
  
      <!-- Featured Components -->
      <section class="py-12 bg-gray-50">
        <div class="container mx-auto px-4">
          <div class="flex justify-between items-center mb-8">
            <h2 class="text-2xl font-bold text-gray-800">Featured Components</h2>
            <div class="flex items-center">
              <div class="relative mr-4">
                <input 
                  type="text" 
                  placeholder="Search components..." 
                  class="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full"
                  v-model="searchQuery"
                />
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <a href="/components" class="text-emerald-600 hover:text-emerald-700 font-medium">View All</a>
            </div>
          </div>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div v-for="(component, index) in filteredComponents" :key="index" class="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition">
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
                <p class="text-sm text-gray-600 mt-1">{{ component.description }}</p>
                <div class="mt-4 flex justify-between items-center">
                  <span class="text-sm text-gray-500">Stock: {{ component.stock }}</span>
                  <!-- <button 
                    :disabled="!component.available || !isLoggedIn" 
                    :class="`px-3 py-1 rounded text-sm ${component.available && isLoggedIn ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`"
                  >
                    {{ isLoggedIn ? 'Borrow' : 'Login to Borrow' }}
                  </button> -->
                  <a href="/components"
                    class="px-3 py-1 rounded text-sm bg-emerald-600 text-white hover:bg-emerald-700"
                  >
                    Borrow
                  </a>
                  <!-- <button 
                    class="px-3 py-1 rounded text-sm bg-emerald-600 text-white hover:bg-emerald-700"
                  >
                  Borrow
                  </button> -->
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
  
      <!-- Quick Actions -->
      <section v-if="isLoggedIn && (userRole === 'admin' || userRole === 'manager')" class="py-12 bg-white">
        <div class="container mx-auto px-4">
          <h2 class="text-2xl font-bold text-gray-800 mb-8">Quick Actions</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div class="bg-emerald-50 p-6 rounded-lg border border-emerald-100">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-emerald-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <h3 class="text-lg font-medium text-gray-800 mb-2">Add New Component</h3>
              <p class="text-gray-600 mb-4">Add a new component to the inventory system.</p>
              <button class="text-emerald-600 font-medium hover:text-emerald-700">Add Component →</button>
            </div>
            <div class="bg-blue-50 p-6 rounded-lg border border-blue-100">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-blue-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 class="text-lg font-medium text-gray-800 mb-2">Manage Requests</h3>
              <p class="text-gray-600 mb-4">View and manage pending borrow requests.</p>
              <button class="text-blue-600 font-medium hover:text-blue-700">View Requests →</button>
            </div>
            <div class="bg-purple-50 p-6 rounded-lg border border-purple-100">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-purple-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 class="text-lg font-medium text-gray-800 mb-2">Generate Reports</h3>
              <p class="text-gray-600 mb-4">Create reports on inventory usage and status.</p>
              <button class="text-purple-600 font-medium hover:text-purple-700">Create Report →</button>
            </div>
          </div>
        </div>
      </section>
  
      <!-- How It Works -->
      <section class="py-12 bg-gray-50">
        <div class="container mx-auto px-4">
          <h2 class="text-2xl font-bold text-gray-800 text-center mb-12">How It Works</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="text-center">
              <div class="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 text-xl font-bold mx-auto mb-4">1</div>
              <h3 class="text-lg font-medium text-gray-800 mb-2">Browse & Request</h3>
              <p class="text-gray-600">Browse through our inventory of electronic components and request the ones you need.</p>
            </div>
            <div class="text-center">
              <div class="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 text-xl font-bold mx-auto mb-4">2</div>
              <h3 class="text-lg font-medium text-gray-800 mb-2">Collect Components</h3>
              <p class="text-gray-600">Once approved, collect your components from the Inovus Labs.</p>
            </div>
            <div class="text-center">
              <div class="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 text-xl font-bold mx-auto mb-4">3</div>
              <h3 class="text-lg font-medium text-gray-800 mb-2">Return When Done</h3>
              <p class="text-gray-600">Return the components when your project is complete for others to use.</p>
            </div>
          </div>
        </div>
      </section>
  
      <!-- Login Modal -->
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
            <button @click="login" class="w-full bg-emerald-600 text-white py-2 rounded-md hover:bg-emerald-700 transition">Login</button>
          </div>
          <div class="mt-4 text-center text-sm text-gray-600">
            Don't have an account? 
            <button 
              @click="showLoginModal = false; showRegistrationModal = true" 
              class="text-emerald-600 hover:text-emerald-500"
            >
              Register
            </button>
          </div>
        </div>
      </div>
      <!-- Register modal -->
       <div v-if="showRegistrationModal" class="fixed inset-0 bg-black/85 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-bold text-gray-800">Registration</h3>
            <button @click="showRegistrationModal = false" class="text-gray-500 hover:text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="space-y-4">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input type="text" id="name" v-model="registrationForm.name" class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
              <input type="tel" id="phone" v-model="registrationForm.phone" class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" id="email" v-model="registrationForm.email" class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input type="password" id="password" v-model="registrationForm.password" class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>            
            <button @click="register" class="w-full bg-emerald-600 text-white py-2 rounded-md hover:bg-emerald-700 transition">Register</button>
          </div>
          <div class="mt-4 text-center text-sm text-gray-600">
            Already have an account? <button @click="showRegistrationModal = false; showLoginModal = true" class="text-emerald-600 hover:text-emerald-500">Login</button>
          </div>
        </div>
      </div>

  
      <!-- Footer -->
      <Footer />
    </div>
  </template>
  
  <script>
import NavBar from '../components/NavBar.vue';
import Footer from '../components/Footer.vue';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';

export default {
  name: 'HomeView',
  components: {
    NavBar,
    Footer
  },
  data() {
    return {
      isLoggedIn: false,
      userRole: null,
      userName: "",
      isMobileMenuOpen: false,
      isProfileOpen: false,
      showLoginModal: false,
      showRegistrationModal: false,
      loginForm: {
        email: '',
        password: '',
        remember: false
      },
      registrationForm: {
        name: '',
        email: '',
        phone: '',
        password: ''
      },
      stats: {
        totalComponents: 0,
        availableComponents: 0,
        activeUsers: 45 // Placeholder for active users
      },
      components: [], // Dynamic components list
      searchQuery: ''
    };
  },
  async created() {
    try {
      await this.fetchComponents();
    } catch (error) {
      console.error("Error during component fetch:", error);
    }
  },
  computed: {
    userInitials() {
      if (!this.userName) return '';
      return this.userName.split(' ').map(n => n[0]).join('').toUpperCase();
    },
    filteredComponents() {
      if (!this.searchQuery) return this.components;
      const query = this.searchQuery.toLowerCase();
      return this.components.filter(component =>
        component.name.toLowerCase().includes(query) ||
        component.description.toLowerCase().includes(query)
      );
    }
  },
  methods: {
    async fetchComponents() {
      try {
        const componentsSnapshot = await getDocs(collection(db, 'components'));
        this.components = componentsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          image: doc.data().image || 'https://via.placeholder.com/150?text=No+Image',
          name: doc.data().name || 'Unnamed Component',
          description: doc.data().description || 'No description available',
          stock: doc.data().stock || 0,
          available: doc.data().available || 0
        }));
        this.stats.totalComponents = this.components.length;
        this.stats.availableComponents = this.components.filter(c => c.available > 0).length;
      } catch (error) {
        console.error('Error fetching components:', error);
        alert('Failed to load components. Please try again later.');
      }
    },
    async login() {
      try {
        // Import Firebase authentication
        const { getAuth, signInWithEmailAndPassword } = await import('firebase/auth');
        const auth = getAuth();
        
        // Validate inputs
        if (!this.loginForm.email || !this.loginForm.password) {
          alert("Please enter both email and password.");
          return;
        }
        
        // Attempt to sign in with Firebase Auth
        const userCredential = await signInWithEmailAndPassword(
          auth, 
          this.loginForm.email, 
          this.loginForm.password
        );
        
        // Check if auth was successful and user was returned
        const user = userCredential.user;
        if (!user) {
          throw new Error("Authentication succeeded but no user was returned");
        }
        
        console.log("Authentication successful. User ID:", user.uid);
        
        // Update the UI state
        this.isLoggedIn = true;
        this.userName = user.displayName || this.loginForm.email.split('@')[0];
        this.userRole = this.loginForm.email.includes('admin') ? 'admin' : 'user';
        this.showLoginModal = false;
        
        // Verify the current user is set correctly
        const currentUser = auth.currentUser;
        if (currentUser && currentUser.uid === user.uid) {
          console.log("User is correctly saved in auth state");
          alert("Login successful!");
        } else {
          console.error("User authentication state mismatch");
          alert("Login partially successful. Please try again if you experience any issues.");
        }
      } catch (error) {
        console.error("Error logging in:", error);
        alert(`Login failed: ${error.message || "Unknown error"}`);
      }
    },
    register() {
      if (this.registrationForm.name && this.registrationForm.email && this.registrationForm.phone && this.registrationForm.password) {
        this.isLoggedIn = true;
        this.userName = this.registrationForm.name;

        // Simulate different user roles based on email
        if (this.registrationForm.email.includes('admin')) {
          this.userRole = 'admin';
        } else if (this.registrationForm.email.includes('manager')) {
          this.userRole = 'manager';
        } else {
          this.userRole = 'user';
        }

        this.showRegistrationModal = false;
        alert("Registration successful!");
      } else {
        alert("Please fill in all required fields.");
      }
    },
    logout() {
      this.isLoggedIn = false;
      this.userRole = 'user';
      this.isProfileOpen = false;
      alert("Successfully logged out.");
    }
  }
};
</script>
  
  <style scoped>
  /* Any additional custom styles can go here */
  .transition {
    transition: all 0.3s ease;
  }
  </style>