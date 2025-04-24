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

  <!-- Status Changed Notification -->
  <div v-if="statusChangeNotification.show" 
       class="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded max-w-md shadow-lg z-50 flex items-center"
       role="alert">
    <div class="flex-grow">
      <strong class="font-bold mr-1">Success!</strong>
      <span class="block sm:inline">{{ statusChangeNotification.message }}</span>
    </div>
    <button @click="statusChangeNotification.show = false" class="ml-4">
      <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
      </svg>
    </button>
  </div>

  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Order Management</h1>
      <div class="flex space-x-4">
        <router-link 
          to="/admin/products" 
          class="bg-white border border-indigo-600 text-indigo-600 py-2 px-4 rounded-md hover:bg-indigo-50 transition"
        >
          Manage Products
        </router-link>
      </div>
    </div>

    <!-- Order Filters -->
    <div class="bg-white p-4 rounded-lg shadow-md mb-6">
      <div class="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-2 md:space-y-0">
        <div class="flex-grow">
          <label class="block text-sm font-medium text-gray-700 mb-1">Search Orders</label>
          <input 
            type="text" 
            v-model="searchTerm" 
            placeholder="Search by product name, customer name or email..."
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        
        <!-- Add specific email search for admin -->
        <div class="flex-grow">
          <label class="block text-sm font-medium text-gray-700 mb-1">Filter by Email</label>
          <div class="flex items-center">
            <input 
              type="email" 
              v-model="emailFilter" 
              placeholder="Enter customer email..."
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            <button 
              @click="clearEmailFilter"
              v-if="emailFilter"
              class="ml-2 p-1 text-gray-400 hover:text-gray-600"
              title="Clear email filter"
            >
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
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
      <p class="text-lg">Loading orders...</p>
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
        {{ orders.length === 0 ? "No orders have been placed yet." : "No orders match your search criteria." }}
      </p>
    </div>

    <!-- Order List -->
    <div v-else class="space-y-6">
      <div 
        v-for="order in filteredOrders" 
        :key="order.id" 
        class="bg-white rounded-lg shadow-md overflow-hidden"
      >
        <div class="bg-gray-50 px-6 py-4 border-b flex justify-between items-center flex-wrap gap-2">
          <div>
            <h3 class="text-lg font-semibold">Order #{{ order.id.slice(-6).toUpperCase() }}</h3>
            <p class="text-gray-600 text-sm">
              {{ new Date(order.orderedAt.toDate()).toLocaleDateString() }}
              at {{ new Date(order.orderedAt.toDate()).toLocaleTimeString() }}
            </p>
          </div>
          
          <div class="flex items-center">
            <span 
              class="px-3 py-1 rounded-full text-xs font-medium mr-3"
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
            
            <!-- Enhanced Update Status Dropdown -->
            <div class="relative inline-block text-left" v-if="order.status !== 'cancelled' && order.status !== 'delivered'">
              <label class="text-xs text-gray-500 block mb-1">Update Status:</label>
              <div class="flex items-center">
                <select 
                  @change="updateOrderStatus(order.id, $event)" 
                  class="block w-full pl-3 pr-10 py-1.5 text-sm border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                  :value="order.status"
                >
                  <option value="pending" :disabled="order.status !== 'pending'">Pending</option>
                  <option value="processing" :disabled="['delivered', 'shipped'].includes(order.status)">Processing</option>
                  <option value="shipped" :disabled="order.status === 'delivered'">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div class="p-6">
          <div class="flex flex-col md:flex-row mb-4">
            <!-- Product & Customer Info -->
            <div class="flex-grow md:mr-6">
              <div class="flex flex-col sm:flex-row sm:items-center mb-4">
                <div class="flex items-start mb-3 sm:mb-0">
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
                
                <div class="bg-gray-100 rounded-lg p-3 flex-grow sm:ml-4">
                  <h4 class="text-sm font-medium text-gray-700">Customer:</h4>
                  <p class="text-sm text-gray-600">{{ order.customerName }}</p>
                  <p class="text-sm text-gray-600">{{ order.customerEmail }}</p>
                  <p class="text-sm text-gray-600">{{ order.customerPhone }}</p>
                </div>
              </div>
              
              <!-- Shipping Address -->
              <div>
                <h5 class="text-sm font-medium text-gray-700">Shipping Address:</h5>
                <p class="text-gray-600 mt-1">{{ order.deliveryAddress }}</p>
              </div>
            </div>

            <!-- Order Actions -->
            <div class="flex flex-col items-start mt-4 md:mt-0 space-y-2">
              <!-- Order Status Card for Quick Change -->
              <div class="bg-gray-50 p-3 rounded-lg border border-gray-200 w-full md:w-auto mb-3">
                <h4 class="text-sm font-semibold mb-2">Quick Status Update</h4>
                <div class="flex flex-wrap gap-1">
                  <button 
                    v-if="order.status === 'pending'"
                    @click="quickStatusUpdate(order.id, 'processing')"
                    class="px-2 py-1 text-xs rounded bg-blue-100 text-blue-800 hover:bg-blue-200"
                  >
                    Mark as Processing
                  </button>
                  <button 
                    v-if="['pending', 'processing'].includes(order.status)"
                    @click="quickStatusUpdate(order.id, 'shipped')"
                    class="px-2 py-1 text-xs rounded bg-purple-100 text-purple-800 hover:bg-purple-200"
                  >
                    Mark as Shipped
                  </button>
                  <button 
                    v-if="['pending', 'processing', 'shipped'].includes(order.status)"
                    @click="quickStatusUpdate(order.id, 'delivered')"
                    class="px-2 py-1 text-xs rounded bg-green-100 text-green-800 hover:bg-green-200"
                  >
                    Mark as Delivered
                  </button>
                  <button 
                    v-if="order.status !== 'cancelled' && order.status !== 'delivered'"
                    @click="quickStatusUpdate(order.id, 'cancelled')"
                    class="px-2 py-1 text-xs rounded bg-red-100 text-red-800 hover:bg-red-200"
                  >
                    Cancel Order
                  </button>
                </div>
              </div>
              
              <button 
                @click="toggleOrderDetails(order.id)" 
                class="text-indigo-600 hover:text-indigo-800 flex items-center text-sm"
              >
                {{ expandedOrder === order.id ? 'Hide Details' : 'View Details' }}
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
            </div>
          </div>

          <!-- Expanded Details -->
          <div v-if="expandedOrder === order.id" class="mt-4 pt-4 border-t">
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
            
            <!-- Order Timeline -->
            <div class="mt-4">
              <h5 class="text-sm font-medium text-gray-700">Order Timeline:</h5>
              <div class="mt-2 space-y-3">
                <!-- Order placed -->
                <div class="flex items-center">
                  <div class="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center mr-3">
                    <svg class="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <div class="flex items-center">
                      <span class="text-gray-700 font-medium text-sm">Order Placed</span>
                    </div>
                    <p class="text-xs text-gray-500">
                      {{ new Date(order.orderedAt.toDate()).toLocaleString() }}
                    </p>
                  </div>
                </div>
                
                <!-- Processing -->
                <div class="flex items-center" :class="{ 'opacity-50': order.status === 'pending' || order.status === 'cancelled' }">
                  <div class="h-5 w-5 rounded-full flex items-center justify-center mr-3"
                       :class="{ 'bg-green-500': ['processing', 'shipped', 'delivered'].includes(order.status), 'bg-gray-300': order.status === 'pending' || order.status === 'cancelled' }">
                    <svg v-if="['processing', 'shipped', 'delivered'].includes(order.status)" class="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <div class="flex items-center">
                      <span class="text-gray-700 font-medium text-sm">Processing</span>
                    </div>
                    <p class="text-xs text-gray-500">
                      {{ order.processingAt ? new Date(order.processingAt.toDate()).toLocaleString() : 'Pending' }}
                    </p>
                  </div>
                </div>
                
                <!-- Shipped -->
                <div class="flex items-center" :class="{ 'opacity-50': !['shipped', 'delivered'].includes(order.status) }">
                  <div class="h-5 w-5 rounded-full flex items-center justify-center mr-3"
                       :class="{ 'bg-green-500': ['shipped', 'delivered'].includes(order.status), 'bg-gray-300': !['shipped', 'delivered'].includes(order.status) }">
                    <svg v-if="['shipped', 'delivered'].includes(order.status)" class="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <div class="flex items-center">
                      <span class="text-gray-700 font-medium text-sm">Shipped</span>
                    </div>
                    <p class="text-xs text-gray-500">
                      {{ order.shippedAt ? new Date(order.shippedAt.toDate()).toLocaleString() : 'Pending' }}
                    </p>
                  </div>
                </div>
                
                <!-- Delivered -->
                <div class="flex items-center" :class="{ 'opacity-50': order.status !== 'delivered' }">
                  <div class="h-5 w-5 rounded-full flex items-center justify-center mr-3"
                       :class="{ 'bg-green-500': order.status === 'delivered', 'bg-gray-300': order.status !== 'delivered' }">
                    <svg v-if="order.status === 'delivered'" class="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <div class="flex items-center">
                      <span class="text-gray-700 font-medium text-sm">Delivered</span>
                    </div>
                    <p class="text-xs text-gray-500">
                      {{ order.deliveredAt ? new Date(order.deliveredAt.toDate()).toLocaleString() : 'Pending' }}
                    </p>
                  </div>
                </div>
                
                <!-- Cancelled -->
                <div v-if="order.status === 'cancelled'" class="flex items-center">
                  <div class="h-5 w-5 rounded-full bg-red-500 flex items-center justify-center mr-3">
                    <svg class="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <div class="flex items-center">
                      <span class="text-gray-700 font-medium text-sm">Cancelled</span>
                    </div>
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
    
    <!-- Pagination (if needed) -->
    <div v-if="filteredOrders.length > 0" class="mt-6 flex justify-between items-center">
      <p class="text-sm text-gray-700">
        Showing <span class="font-medium">{{ filteredOrders.length }}</span> of 
        <span class="font-medium">{{ orders.length }}</span> orders
      </p>
    </div>
  </div>

  <Footer />
</template>

<script>
import NavBar from '../components/NavBar.vue'
import Footer from '../components/Footer.vue'
import { collection, query, getDocs, orderBy, updateDoc, doc, Timestamp } from 'firebase/firestore'
import { db } from '../firebase/config'

export default {
  name: 'AdminOrdersView',
  components: {
    NavBar,
    Footer
  },
  data() {
    return {
      isLoggedIn: true,
      userName: 'Admin User',
      userRole: 'admin',
      isMobileMenuOpen: false,
      isProfileOpen: false,
      showLoginModal: false,
      
      // Orders
      orders: [],
      loading: true,
      expandedOrder: null,
      
      // Filters and Sorting
      searchTerm: '',
      statusFilter: 'all',
      sortOption: 'date-desc',

      // Add email filter
      emailFilter: '',

      // Status change notification
      statusChangeNotification: {
        show: false,
        message: '',
        timeout: null
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
          order.productName.toLowerCase().includes(searchLower) ||
          order.customerName.toLowerCase().includes(searchLower) ||
          order.customerEmail.toLowerCase().includes(searchLower)
        )
      }
      
      // Filter by specific email
      if (this.emailFilter.trim()) {
        result = result.filter(order => 
          order.customerEmail.toLowerCase() === this.emailFilter.toLowerCase()
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
    this.fetchAllOrders()
  },
  methods: {
    logout() {
      this.isLoggedIn = false
      this.userRole = 'user'
      this.isProfileOpen = false
      this.$router.push('/products')
    },
    
    async fetchAllOrders() {
      this.loading = true
      
      try {
        const q = query(
          collection(db, 'salesOrders'), 
          orderBy('orderedAt', 'desc')
        )
        
        const querySnapshot = await getDocs(q)
        this.orders = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
      } catch (error) {
        console.error('Error fetching orders:', error)
      } finally {
        this.loading = false
      }
    },
    
    toggleOrderDetails(orderId) {
      if (this.expandedOrder === orderId) {
        this.expandedOrder = null
      } else {
        this.expandedOrder = orderId
      }
    },
    
    // Update quick status method
    quickStatusUpdate(orderId, newStatus) {
      // Create a synthetic event object to pass to updateOrderStatus
      const event = { target: { value: newStatus } };
      this.updateOrderStatus(orderId, event);
    },

    async updateOrderStatus(orderId, event) {
      const newStatus = event.target.value
      const orderRef = doc(db, 'salesOrders', orderId)
      
      const orderIndex = this.orders.findIndex(order => order.id === orderId)
      if (orderIndex === -1) return
      
      const currentOrder = this.orders[orderIndex]
      const oldStatus = currentOrder.status
      const updates = { status: newStatus }
      
      // Add timestamp for the status change
      switch (newStatus) {
        case 'processing':
          updates.processingAt = Timestamp.now()
          break
        case 'shipped':
          updates.shippedAt = Timestamp.now()
          // If we didn't have a processingAt timestamp, add it now
          if (!currentOrder.processingAt) {
            updates.processingAt = Timestamp.now()
          }
          break
        case 'delivered':
          updates.deliveredAt = Timestamp.now()
          // If we didn't have processingAt or shippedAt timestamps, add them now
          if (!currentOrder.processingAt) {
            updates.processingAt = Timestamp.now()
          }
          if (!currentOrder.shippedAt) {
            updates.shippedAt = Timestamp.now()
          }
          break
        case 'cancelled':
          updates.cancelledAt = Timestamp.now()
          break
      }
      
      try {
        await updateDoc(orderRef, updates)
        
        // Update local state
        this.orders[orderIndex] = {
          ...currentOrder,
          ...updates
        }
        
        // Show success notification
        this.showStatusChangeNotification(oldStatus, newStatus, currentOrder.productName);
        
      } catch (error) {
        console.error('Error updating order status:', error)
        alert('Failed to update order status. Please try again.')
      }
    },
    
    showStatusChangeNotification(oldStatus, newStatus, productName) {
      // Clear any existing timeout
      if (this.statusChangeNotification.timeout) {
        clearTimeout(this.statusChangeNotification.timeout);
      }
      
      // Set notification message
      this.statusChangeNotification.message = `Order for ${productName} updated from ${oldStatus} to ${newStatus}.`;
      this.statusChangeNotification.show = true;
      
      // Auto-hide notification after 5 seconds
      this.statusChangeNotification.timeout = setTimeout(() => {
        this.statusChangeNotification.show = false;
      }, 5000);
    },

    clearEmailFilter() {
      this.emailFilter = '';
    }
  }
}
</script>

<style scoped>
/* Add smooth transition for notification */
[role="alert"] {
  transition: opacity 0.5s ease-in-out;
}
</style>
