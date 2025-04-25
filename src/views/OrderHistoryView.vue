<template>
  <NavBar
    :is-logged-in="isLoggedIn"
    :user-name="userName"
    :user-role="userRole"
    :is-mobile-menu-open="isMobileMenuOpen"
    :is-profile-open="isProfileOpen"
    @toggle-mobile-menu="isMobileMenuOpen = !isMobileMenuOpen"
    @toggle-profile="isProfileOpen = !isProfileOpen"
    @logout="logout"
    @show-login-modal="showLoginModal = true"
  />

  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold">Your Order History</h1>
        <p v-if="userEmail" class="text-sm text-gray-600 mt-1">
          Showing orders for: <span class="font-medium">{{ userEmail }}</span>
        </p>
      </div>
      <router-link 
        to="/products" 
        class="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition"
      >
        Back to Shop
      </router-link>
    </div>

    <!-- Email Input for Searching Orders -->
    <div class="bg-white p-4 rounded-lg shadow-md mb-6">
      <div class="flex flex-col sm:flex-row sm:items-end gap-4">
        <div class="flex-grow">
          <label class="block text-sm font-medium text-gray-700 mb-1">Find Your Orders by Email</label>
          <input 
            v-model="emailInput" 
            type="email" 
            disabled
            placeholder="Enter your order email..."
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          <p v-if="userEmail" class="mt-1 text-xs text-gray-500">Currently showing orders for: <strong>{{ userEmail }}</strong></p>
        </div>
        <button 
          @click="findOrdersByEmail" 
          class="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition flex-shrink-0"
        >
          Search Orders
        </button>
      </div>
      
      <!-- Debug Information (can be removed in production) -->
      <div v-if="debugInfo && debugInfo.error" class="mt-3 bg-red-50 border border-red-200 rounded-md p-3 text-sm">
        <p class="font-medium text-red-800">Error details (for debugging):</p>
        <pre class="mt-1 text-xs text-red-700 overflow-auto">{{ debugInfo.error }}</pre>
      </div>
    </div>

    <!-- User Not Logged In Warning -->
    <div v-if="!isLoggedIn" class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm text-yellow-700">
            You're viewing order history for <strong>{{ userName }}</strong>. Log in to see your personal order history.
          </p>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white p-4 rounded-lg shadow-md mb-6">
      <div class="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-2 md:space-y-0">
        <div class="flex-grow">
          <label class="block text-sm font-medium text-gray-700 mb-1">Search Orders</label>
          <input 
            type="text" 
            v-model="searchTerm" 
            placeholder="Search by product name..."
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Filter by Status</label>
          <select 
            v-model="statusFilter" 
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Sort by</label>
          <select 
            v-model="sortOption" 
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="price-desc">Price (High to Low)</option>
            <option value="price-asc">Price (Low to High)</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <p class="text-lg">Loading your order history...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredOrders.length === 0" class="bg-white rounded-lg shadow-md p-8 text-center">
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        class="h-16 w-16 mx-auto text-gray-400 mb-4" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          stroke-linecap="round" 
          stroke-linejoin="round" 
          stroke-width="2" 
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
      </svg>
      <h2 class="text-xl font-semibold mb-2">No Orders Found</h2>
      <p class="text-gray-600 mb-6">
        {{ userEmail ? `We couldn't find any orders for ${userEmail}.` : "Please enter your email to find your orders." }}
      </p>
      <router-link 
        to="/products" 
        class="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          class="h-5 w-5 mr-2" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            stroke-width="2" 
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        Browse Products
      </router-link>
    </div>

    <!-- Order List -->
    <div v-else class="space-y-6">
      <div 
        v-for="order in filteredOrders" 
        :key="order.id" 
        class="bg-white rounded-lg shadow-md overflow-hidden"
      >
        <div class="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
          <div>
            <h3 class="text-lg font-semibold">Order #{{ order.id.slice(-6).toUpperCase() }}</h3>
            <p class="text-gray-600 text-sm">
              {{ new Date(order.orderedAt.toDate()).toLocaleDateString() }}
              at {{ new Date(order.orderedAt.toDate()).toLocaleTimeString() }}
            </p>
          </div>
          <div class="flex items-center">
            <span 
              class="px-3 py-1 rounded-full text-xs font-medium"
              :class="{
                'bg-yellow-100 text-yellow-800': order.status === 'pending',
                'bg-blue-100 text-blue-800': order.status === 'processing',
                'bg-purple-100 text-purple-800': order.status === 'shipped',
                'bg-green-100 text-green-800': order.status === 'delivered',
                'bg-red-100 text-red-800': order.status === 'cancelled'
              }"
            >
              {{ order.status.charAt(0).toUpperCase() + order.status.slice(1) }}
            </span>
          </div>
        </div>

        <div class="p-6">
          <div class="flex flex-col md:flex-row">
            <!-- Product Info -->
            <div class="flex-grow mb-4 md:mb-0">
              <div class="flex items-start">
                <img 
                  v-if="order.productImageUrl" 
                  :src="order.productImageUrl" 
                  :alt="order.productName" 
                  class="w-16 h-16 object-cover rounded mr-4"
                />
                <div v-else class="w-16 h-16 bg-gray-200 rounded mr-4 flex items-center justify-center">
                  <span class="text-gray-500 text-xs">No image</span>
                </div>
                <div>
                  <h4 class="font-semibold">{{ order.productName }}</h4>
                  <p class="text-indigo-600 font-bold mt-1">₹{{ order.productPrice.toFixed(2) }}</p>
                </div>
              </div>
              
              <!-- Shipping Address -->
              <div class="mt-4">
                <h5 class="text-sm font-medium text-gray-700">Shipping Address:</h5>
                <p class="text-gray-600 mt-1">{{ order.deliveryAddress }}</p>
              </div>
            </div>

            <!-- Order Actions -->
            <div class="flex flex-col items-start md:items-end space-y-2 md:ml-6">
              <button 
                @click="toggleOrderDetails(order.id)" 
                class="text-indigo-600 hover:text-indigo-800 flex items-center text-sm"
              >
                {{ expandedOrder === order.id ? 'Hide Details' : 'Show Details' }}
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  class="h-4 w-4 ml-1" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                  :class="{ 'transform rotate-180': expandedOrder === order.id }"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <button 
                v-if="order.status === 'pending'" 
                @click="cancelOrder(order.id)"
                class="text-red-600 hover:text-red-800 flex items-center text-sm"
              >
                Cancel Order
              </button>
            </div>
          </div>

          <!-- Expanded Details -->
          <div v-if="expandedOrder === order.id" class="mt-6 pt-4 border-t">
            <div class="space-y-4">
              <!-- Contact Info -->
              <div>
                <h5 class="text-sm font-medium text-gray-700">Contact Information:</h5>
                <p class="text-gray-600 mt-1">{{ order.customerName }}</p>
                <p class="text-gray-600">{{ order.customerEmail }}</p>
                <p class="text-gray-600">{{ order.customerPhone }}</p>
              </div>
              
              <!-- Payment Info -->
              <div>
                <h5 class="text-sm font-medium text-gray-700">Payment Screenshot:</h5>
                <div class="mt-2">
                  <img 
                    :src="order.paymentScreenshotUrl" 
                    alt="Payment Proof" 
                    class="h-40 object-contain rounded-md border border-gray-200"
                  />
                </div>
              </div>
              
              <!-- Timeline -->
              <div>
                <h5 class="text-sm font-medium text-gray-700">Order Timeline:</h5>
                <div class="mt-2 space-y-2">
                  <!-- Order Placed - Always show this -->
                  <div class="flex items-center">
                    <div class="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center mr-3">
                      <svg class="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <span class="text-gray-600 text-sm">Order Placed</span>
                      <p class="text-xs text-gray-500">
                        {{ new Date(order.orderedAt.toDate()).toLocaleDateString() }}
                        at {{ new Date(order.orderedAt.toDate()).toLocaleTimeString() }}
                      </p>
                    </div>
                  </div>
                  
                  <!-- Processing status -->
                  <div 
                    class="flex items-center"
                    :class="{ 'opacity-40': order.status === 'pending' || order.status === 'cancelled' }"
                  >
                    <div 
                      class="h-5 w-5 rounded-full flex items-center justify-center mr-3"
                      :class="{ 
                        'bg-green-500': order.status !== 'pending' && order.status !== 'cancelled',
                        'bg-gray-300': order.status === 'pending' || order.status === 'cancelled'
                      }"
                    >
                      <svg v-if="order.status !== 'pending' && order.status !== 'cancelled'" class="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <span class="text-gray-600 text-sm">Processing</span>
                      <p class="text-xs text-gray-500">
                        {{ order.processingAt ? new Date(order.processingAt.toDate()).toLocaleString() : 'Pending' }}
                      </p>
                    </div>
                  </div>
                  
                  <!-- Shipped status -->
                  <div 
                    class="flex items-center"
                    :class="{ 'opacity-40': ['pending', 'processing', 'cancelled'].includes(order.status) }"
                  >
                    <div 
                      class="h-5 w-5 rounded-full flex items-center justify-center mr-3"
                      :class="{ 
                        'bg-green-500': order.status === 'shipped' || order.status === 'delivered',
                        'bg-gray-300': ['pending', 'processing', 'cancelled'].includes(order.status)
                      }"
                    >
                      <svg v-if="order.status === 'shipped' || order.status === 'delivered'" class="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <span class="text-gray-600 text-sm">Shipped</span>
                      <p class="text-xs text-gray-500">
                        {{ order.shippedAt ? new Date(order.shippedAt.toDate()).toLocaleString() : 'Pending' }}
                      </p>
                    </div>
                  </div>
                  
                  <!-- Delivered status -->
                  <div 
                    class="flex items-center"
                    :class="{ 'opacity-40': order.status !== 'delivered' }"
                  >
                    <div 
                      class="h-5 w-5 rounded-full flex items-center justify-center mr-3"
                      :class="{ 
                        'bg-green-500': order.status === 'delivered',
                        'bg-gray-300': order.status !== 'delivered'
                      }"
                    >
                      <svg v-if="order.status === 'delivered'" class="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <span class="text-gray-600 text-sm">Delivered</span>
                      <p class="text-xs text-gray-500">
                        {{ order.deliveredAt ? new Date(order.deliveredAt.toDate()).toLocaleString() : 'Pending' }}
                      </p>
                    </div>
                  </div>
                  
                  <!-- Cancelled status if applicable -->
                  <div 
                    v-if="order.status === 'cancelled'"
                    class="flex items-center"
                  >
                    <div class="h-5 w-5 rounded-full bg-red-500 flex items-center justify-center mr-3">
                      <svg class="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <span class="text-gray-600 text-sm">Order Cancelled</span>
                      <p class="text-xs text-gray-500">
                        {{ order.cancelledAt ? new Date(order.cancelledAt.toDate()).toLocaleString() : 'Date unavailable' }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <Footer />
</template>

<script>
import NavBar from '../components/NavBar.vue'
import Footer from '../components/Footer.vue'
import { collection, query, where, getDocs, orderBy, updateDoc, doc } from 'firebase/firestore'
import { db } from '../firebase/config'

export default {
  name: 'OrderHistoryView',
  components: {
    NavBar,
    Footer
  },
  data() {
    return {
      isLoggedIn: false,
      userName: 'John Doe',
      userRole: 'user',
      isMobileMenuOpen: false,
      isProfileOpen: false,
      showLoginModal: false,
      
      // User identification
      userEmail: '',
      emailInput: '',
      
      // Orders
      orders: [],
      loading: true,
      expandedOrder: null,
      
      // Filters and Sorting
      searchTerm: '',
      statusFilter: 'all',
      sortOption: 'date-desc',

      // Add debugging info
      debugInfo: {
        error: null,
        lastQuery: null
      }
    }
  },
  computed: {
    userInitials() {
      if (!this.userName) return ''
      return this.userName.split(' ').map(n => n[0]).join('').toUpperCase()
    },
    
    filteredOrders() {
      let result = [...this.orders]
      
      // Filter by search term
      if (this.searchTerm.trim()) {
        const searchLower = this.searchTerm.toLowerCase()
        result = result.filter(order => 
          order.productName.toLowerCase().includes(searchLower)
        )
      }
      
      // Filter by status
      if (this.statusFilter !== 'all') {
        result = result.filter(order => order.status === this.statusFilter)
      }
      
      // Sort orders
      switch (this.sortOption) {
        case 'date-desc':
          result.sort((a, b) => b.orderedAt.toDate() - a.orderedAt.toDate())
          break
        case 'date-asc':
          result.sort((a, b) => a.orderedAt.toDate() - b.orderedAt.toDate())
          break
        case 'price-desc':
          result.sort((a, b) => b.productPrice - a.productPrice)
          break
        case 'price-asc':
          result.sort((a, b) => a.productPrice - b.productPrice)
          break
      }
      
      return result
    }
  },
  mounted() {
    // Get email from various sources
    this.initializeUserEmail();
  },
  methods: {
    logout() {
      this.isLoggedIn = false
      this.userRole = 'user'
      this.isProfileOpen = false
      this.$router.push('/products')
    },
    
    initializeUserEmail() {
      // First try to get email from route query params
      if (this.$route.query.email) {
        this.userEmail = this.$route.query.email;
        this.emailInput = this.$route.query.email;
      } 
      // Then try localStorage
      else {
        const savedEmail = localStorage.getItem('userEmail');
        if (savedEmail) {
          this.userEmail = savedEmail;
          this.emailInput = savedEmail;
        }
      }
      
      // Fetch orders after setting the email
      if (this.userEmail) {
        this.fetchUserOrders();
      } else {
        this.loading = false;
      }
    },
    
    findOrdersByEmail() {
      // Clear any previous errors
      this.debugInfo.error = null;
      
      if (!this.emailInput || !this.emailInput.includes('@')) {
        alert('Please enter a valid email address');
        return;
      }
      
      // Normalize the email (trim whitespace and convert to lowercase)
      const normalizedEmail = this.emailInput.trim().toLowerCase();
      this.userEmail = normalizedEmail;
      localStorage.setItem('userEmail', normalizedEmail);
      
      console.log(`Searching for orders with email: ${normalizedEmail}`);
      this.fetchUserOrders();
    },
    
    async fetchUserOrders() {
      this.loading = true;
      this.debugInfo.error = null;
      
      try {
        if (!this.userEmail) {
          // Handle the case when there's no email
          console.log("No email available to query orders");
          this.orders = [];
          this.loading = false;
          return;
        }
        
        const normalizedEmail = this.userEmail.trim().toLowerCase();
        console.log(`Fetching orders for email: ${normalizedEmail}`);
        
        // First try a simple query without orderBy
        try {
          const simpleQuery = query(
            collection(db, 'salesOrders'),
            where('customerEmail', '==', normalizedEmail)
          );
          
          this.debugInfo.lastQuery = `where('customerEmail', '==', '${normalizedEmail}')`;
          
          const snapshot = await getDocs(simpleQuery);
          
          if (!snapshot.empty) {
            this.orders = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));
            
            console.log(`Found ${this.orders.length} orders for ${normalizedEmail}`);
            this.loading = false;
            return;
          }
        } catch (e) {
          console.log("Simple query failed, trying with compound query...", e);
        }
        
        // If that fails or returns no results, try with compound query 
        const compoundQuery = query(
          collection(db, 'salesOrders'),
          where('customerEmail', '==', normalizedEmail),
          orderBy('orderedAt', 'desc')
        );
        
        this.debugInfo.lastQuery = `where('customerEmail', '==', '${normalizedEmail}') + orderBy('orderedAt', 'desc')`;
        
        const querySnapshot = await getDocs(compoundQuery);
        
        if (querySnapshot.empty) {
          console.log(`No orders found for email: ${normalizedEmail}`);
          // Check if there are any orders in the collection at all
          const checkQuery = query(collection(db, 'salesOrders'), orderBy('orderedAt', 'desc'), getDocs);
          const allOrdersSnapshot = await getDocs(checkQuery);
          
          if (!allOrdersSnapshot.empty) {
            console.log(`Collection has ${allOrdersSnapshot.size} orders, but none match the email.`);
            
            // Log a few order emails to debug
            allOrdersSnapshot.docs.slice(0, 3).forEach(doc => {
              const data = doc.data();
              console.log(`Found order with email: ${data.customerEmail}`);
            });
          } else {
            console.log("The salesOrders collection appears to be empty.");
          }
        }
        
        this.orders = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        console.log(`Found ${this.orders.length} orders for user: ${normalizedEmail}`);
      } catch (error) {
        console.error('Error fetching orders:', error);
        this.debugInfo.error = `${error.message} (code: ${error.code || 'unknown'})`;
        
        // If it's a missing index error, provide helpful information
        if (error.message && error.message.includes('index')) {
          this.debugInfo.error += "\n\nThis may be due to a missing Firestore index. Try using the Firebase console to create the required index.";
        }
        
        this.orders = [];
      } finally {
        this.loading = false;
      }
    },
    
    toggleOrderDetails(orderId) {
      if (this.expandedOrder === orderId) {
        this.expandedOrder = null
      } else {
        this.expandedOrder = orderId
      }
    },
    
    async cancelOrder(orderId) {
      if (!confirm('Are you sure you want to cancel this order?')) return
      
      try {
        const orderRef = doc(db, 'salesOrders', orderId)
        await updateDoc(orderRef, {
          status: 'cancelled',
          cancelledAt: new Date()
        })
        
        // Update local state
        const orderIndex = this.orders.findIndex(order => order.id === orderId)
        if (orderIndex !== -1) {
          this.orders[orderIndex].status = 'cancelled'
          this.orders[orderIndex].cancelledAt = new Date()
        }
        
        alert('Order cancelled successfully')
      } catch (error) {
        console.error('Error cancelling order:', error)
        alert('Failed to cancel order. Please try again.')
      }
    }
  }
}
</script>
