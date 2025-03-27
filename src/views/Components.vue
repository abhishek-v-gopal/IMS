<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header (reusing the same header from HomePage) -->
    <NavBar :isLoggedIn="isLoggedIn" :userName="userName" :userRole="userRole" :userInitials="userInitials"
      :isMobileMenuOpen="isMobileMenuOpen" :isProfileOpen="isProfileOpen" @show-login-modal="showLoginModal = true"
      @logout="logout" />

    <!-- Page Title and Search -->
    <div class="bg-white border-b">
      <div class="container mx-auto px-4 py-8">
        <h1 class="text-2xl font-bold text-gray-800 mb-6">All Components</h1>

        <!-- Add Logout Button -->
        <div v-if="isLoggedIn" class="text-right mb-4">
          <button 
            @click="logout" 
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>

        <!-- Search and Filters -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div class="relative w-full md:w-96">
            <input type="text" placeholder="Search components..."
              class="pl-10 pr-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              v-model="searchQuery" />
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 absolute left-3 top-2.5" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <div class="flex flex-wrap gap-2">
            <select v-model="categoryFilter"
              class="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <option value="">All Categories</option>
              <option value="microcontroller">Microcontrollers</option>
              <option value="sensor">Sensors</option>
              <option value="display">Displays</option>
              <option value="passive">Passive Components</option>
              <option value="tool">Tools</option>
            </select>

            <select v-model="availabilityFilter"
              class="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <option value="">All Availability</option>
              <option value="available">Available</option>
              <option value="borrowed">Borrowed</option>
            </select>

            <select v-model="sortBy"
              class="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500">
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
      <div v-if="loading" class="text-center py-12">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        <h3 class="text-lg font-medium text-gray-700 mb-2">Loading components...</h3>
      </div>
      <div v-else-if="filteredComponents.length === 0" class="text-center py-12">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="text-lg font-medium text-gray-700 mb-2">No components available</h3>
        <p class="text-gray-500">Please check back later or adjust your filters.</p>
      </div>
      <div v-else>
        <!-- Grid View -->
        <div v-if="viewMode === 'grid'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div 
            v-for="(component, index) in filteredComponents" 
            :key="component.id" 
            class="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition"
          >
            <div class="h-40 bg-gray-200 flex items-center justify-center">
              <img 
                :src="component.image || 'default-image.png'" 
                :alt="component.name || 'Component'" 
                class="max-h-full max-w-full object-contain" 
              />
            </div>
            <div class="p-4">
              <div class="flex justify-between items-start">
                <h3 class="font-medium text-gray-800">{{ component.name || 'Unnamed Component' }}</h3>
                <span 
                  :class="`px-2 py-1 text-xs rounded-full ${component.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`"
                >
                  {{ component.available ? 'Available' : 'Not Available' }}
                </span>
              </div>
              <div class="mt-1 text-xs text-gray-500">Category: {{ component.category || 'Uncategorized' }}</div>
              <p class="text-sm text-gray-600 mt-1">{{ component.description || 'No description available' }}</p>
              <div class="mt-4 flex justify-between items-center">
                <span class="text-sm text-gray-500">Stock: {{ component.stock || 0 }}</span>
                <div class="flex space-x-2">
                  <button 
                    @click="openEditModal(component)"
                    v-if="isLoggedIn && (userRole === 'admin' || userRole === 'manager')"
                    class="p-1 text-blue-600 hover:bg-blue-50 rounded"
                    title="Edit Component"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button 
                    @click="confirmDelete(component)"
                    v-if="isLoggedIn && (userRole === 'admin' || userRole === 'manager')"
                    class="p-1 text-red-600 hover:bg-red-50 rounded"
                    title="Delete Component"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                  <button 
                    @click="borrowComponent(component)"
                    :disabled="!component.available || !isLoggedIn"
                    :class="`px-3 py-1 rounded text-sm ${component.available && isLoggedIn ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`"
                  >
                    {{ isLoggedIn ? 'Borrow' : 'Login to Borrow' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Borrow Modal -->
  <div v-if="showBorrowModal" class="fixed inset-0 bg-black/85 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl font-bold text-gray-800">Borrow Component</h3>
        <button @click="closeBorrowModal" class="text-gray-500 hover:text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div class="space-y-4">
        <div>
          <label for="quantity" class="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
          <input 
            type="number" 
            id="quantity" 
            v-model="borrowForm.quantity" 
            class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            min="1"
            :max="selectedComponent.stock"
          />
        </div>
        <button 
          @click="confirmBorrow"
          class="w-full bg-emerald-600 text-white py-2 rounded-md hover:bg-emerald-700 transition"
        >
          Confirm Borrow
        </button>
      </div>
    </div>
  </div>

  <!-- Borrow Request Form -->
  <div v-if="isLoggedIn" class="container mx-auto px-4 py-8">
    <h2 class="text-xl font-bold text-gray-800 mb-4">Borrow Request Form</h2>
    <form @submit.prevent="submitBorrowRequest" class="bg-white p-6 rounded-lg shadow-md">
      <div class="mb-4">
        <label for="componentName" class="block text-sm font-medium text-gray-700">Component Name</label>
        <input 
          type="text" 
          id="componentName" 
          v-model="borrowRequestForm.componentName" 
          class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500" 
          required 
        />
      </div>
      <div class="mb-4">
        <label for="quantity" class="block text-sm font-medium text-gray-700">Quantity</label>
        <input 
          type="number" 
          id="quantity" 
          v-model="borrowRequestForm.quantity" 
          class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500" 
          min="1" 
          required 
        />
      </div>
      <div class="mb-4">
        <label for="reason" class="block text-sm font-medium text-gray-700">Reason</label>
        <textarea 
          id="reason" 
          v-model="borrowRequestForm.reason" 
          class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500" 
          rows="3" 
          required
        ></textarea>
      </div>
      <button 
        type="submit" 
        class="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition"
      >
        Submit Request
      </button>
    </form>
  </div>

  <!-- Pagination -->
  <div class="mt-8 flex items-center justify-between">
    <div class="text-sm text-gray-700">
      Showing <span class="font-medium">1</span> to <span class="font-medium">{{ Math.min(filteredComponents.length, 20)
      }}</span> of <span class="font-medium">{{ filteredComponents.length }}</span> components
    </div>
    <div class="flex space-x-2">
      <button class="px-3 py-1 border rounded-md text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50" disabled>
        Previous
      </button>
      <button class="px-3 py-1 border rounded-md text-sm bg-emerald-50 text-emerald-600 font-medium">
        1
      </button>
      <button v-if="filteredComponents.length > 20"
        class="px-3 py-1 border rounded-md text-sm text-gray-600 hover:bg-gray-50">
        2
      </button>
      <button v-if="filteredComponents.length > 40"
        class="px-3 py-1 border rounded-md text-sm text-gray-600 hover:bg-gray-50">
        3
      </button>
      <button v-if="filteredComponents.length > 20"
        class="px-3 py-1 border rounded-md text-sm text-gray-600 hover:bg-gray-50">
        Next
      </button>
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
          <input type="email" id="email" v-model="loginForm.email"
            class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500" />
        </div>
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input type="password" id="password" v-model="loginForm.password"
            class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500" />
        </div>
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input type="checkbox" id="remember" v-model="loginForm.remember"
              class="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded" />
            <label for="remember" class="ml-2 block text-sm text-gray-700">Remember me</label>
          </div>
          <a href="#" class="text-sm text-emerald-600 hover:text-emerald-500">Forgot password?</a>
        </div>
        <button @click="login"
          class="w-full bg-emerald-600 text-white py-2 rounded-md hover:bg-emerald-700 transition">Login</button>
      </div>
      <div class="mt-4 text-center text-sm text-gray-600">
        Don't have an account? <button @click="showRegistrationModal = true; showLoginModal = false"
          class="text-emerald-600 hover:text-emerald-500">Register</button>
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
          <input type="text" id="name" v-model="registrationForm.name"
            class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500" />
        </div>
        <div>
          <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
          <input type="tel" id="phone" v-model="registrationForm.phone"
            class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500" />
        </div>
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input type="email" id="email" v-model="registrationForm.email"
            class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500" />
        </div>
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input type="password" id="password" v-model="registrationForm.password"
            class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500" />
        </div>
        <button @click="register"
          class="w-full bg-emerald-600 text-white py-2 rounded-md hover:bg-emerald-700 transition">Register</button>
      </div>
      <div class="mt-4 text-center text-sm text-gray-600">
        Already have an account? <button @click="showRegistrationModal = false; showLoginModal = true"
          class="text-emerald-600 hover:text-emerald-500">Login</button>
      </div>
    </div>
  </div>

  <!-- Footer (simplified from HomePage) -->
  <Footer />
  
</template>

<script>
import NavBar from '../components/NavBar.vue';
import Footer from '../components/Footer.vue';
import { collection, getDocs, doc, deleteDoc, updateDoc, addDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';

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
      showRegistrationModal: false,
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

      registrationForm: {
        name: '',
        email: '',
        phone: '',
        password: ''
      },

      // Component data from Firebase
      components: [],
      loading: true,
      error: null,

      // Edit component modal
      showEditModal: false,
      componentToEdit: null,

      // Delete confirmation modal
      showDeleteModal: false,
      componentToDelete: null,
      isDeleting: false,

      // Borrow component modal
      showBorrowModal: false,
      selectedComponent: null,
      borrowForm: {
        quantity: 1
      },

      // Borrow request form
      borrowRequestForm: {
        componentName: '',
        quantity: 1,
        reason: ''
      }
    }
  },

  async created() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.isLoggedIn = true;
        this.userName = user.displayName || user.email.split('@')[0];
        this.userRole = user.email.includes('admin') ? 'admin' : user.email.includes('manager') ? 'manager' : 'user';
      } else {
        this.isLoggedIn = false;
        this.userName = '';
        this.userRole = 'user';
      }
    });
    await this.fetchComponents();
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
      return this.components.filter(c => c.available).length;
    },
    borrowedCount() {
      return this.components.filter(c => !c.available).length;
    },
    categoryCount() {
      const categories = new Set(this.components.map(c => c.category).filter(Boolean));
      return categories.size;
    }
  },

  methods: {
    async fetchComponents() {
      try {
        this.loading = true;
        const componentsSnapshot = await getDocs(collection(db, 'components'));
        this.components = componentsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          image: doc.data().image || null, // Ensure image is defined
          name: doc.data().name || 'Unnamed Component', // Default name
          category: doc.data().category || 'Uncategorized', // Default category
          description: doc.data().description || 'No description available', // Default description
          stock: doc.data().stock || 0, // Default stock
          available: doc.data().available || false, // Default availability
          location: doc.data().location || 'Unknown', // Default location
          manufacturer: doc.data().manufacturer || 'Unknown', // Default manufacturer
          datasheet: doc.data().datasheet || '' // Default datasheet
        }));
        this.loading = false;
      } catch (error) {
        console.error('Error fetching components:', error);
        this.error = 'Failed to load components';
        this.loading = false;
      }
    },

    openEditModal(component) {
      this.componentToEdit = { ...component };
      this.showEditModal = true;
    },

    async saveComponent() {
      try {
        if (!this.componentToEdit || !this.componentToEdit.id) return;

        const componentRef = doc(db, 'components', this.componentToEdit.id);
        await updateDoc(componentRef, {
          name: this.componentToEdit.name,
          description: this.componentToEdit.description,
          category: this.componentToEdit.category,
          stock: this.componentToEdit.stock,
          available: this.componentToEdit.available,
        });

        // Update local state
        const index = this.components.findIndex(c => c.id === this.componentToEdit.id);
        if (index !== -1) {
          this.components[index] = { ...this.componentToEdit };
        }

        this.showEditModal = false;
        this.componentToEdit = null;

        // Add notification or alert of success
        alert('Component updated successfully');
      } catch (error) {
        console.error('Error updating component:', error);
        alert('Failed to update component');
      }
    },

    confirmDelete(component) {
      this.componentToDelete = component;
      this.showDeleteModal = true;
    },

    async deleteComponent() {
      if (!this.componentToDelete || !this.componentToDelete.id) return;

      try {
        this.isDeleting = true;

        // Delete from Firestore
        await deleteDoc(doc(db, 'components', this.componentToDelete.id));

        // Remove from local state
        this.components = this.components.filter(c => c.id !== this.componentToDelete.id);

        this.isDeleting = false;
        this.showDeleteModal = false;
        this.componentToDelete = null;

        // Add notification or alert of success
        alert('Component deleted successfully');
      } catch (error) {
        console.error('Error deleting component:', error);
        this.isDeleting = false;
        alert('Failed to delete component');
      }
    },

    borrowComponent(component) {
      this.selectedComponent = component;
      this.borrowForm.quantity = 1;
      this.showBorrowModal = true;
    },

    async confirmBorrow() {
      if (!this.selectedComponent || this.borrowForm.quantity < 1) return;

      try {
        await addDoc(collection(db, "borrows"), {
          userName: this.userName,
          userId: this.userId, // Assuming userId is available
          componentName: this.selectedComponent.name,
          componentId: this.selectedComponent.id,
          quantity: this.borrowForm.quantity,
          borrowDate: new Date(),
          dueDate: new Date(new Date().setDate(new Date().getDate() + 7)), // Default due date: 7 days from now
          status: "Borrowed"
        });

        alert("Component borrowed successfully!");
        this.showBorrowModal = false;
        this.selectedComponent = null;
        this.borrowForm.quantity = 1;

        // Optionally, refresh the component list
        await this.fetchComponents();
      } catch (error) {
        console.error("Error borrowing component:", error);
        alert("Failed to borrow component.");
      }
    },

    closeBorrowModal() {
      this.showBorrowModal = false;
      this.selectedComponent = null;
      this.borrowForm.quantity = 1;
    },

    async submitBorrowRequest() {
      try {
        const borrowRequest = {
          userName: this.userName,
          userId: this.userId, // Assuming userId is available
          componentName: this.borrowRequestForm.componentName,
          quantity: this.borrowRequestForm.quantity,
          reason: this.borrowRequestForm.reason,
          requestDate: new Date(),
          status: 'Pending'
        };

        await addDoc(collection(db, 'borrowRequests'), borrowRequest);

        alert('Borrow request submitted successfully!');
        this.borrowRequestForm = { componentName: '', quantity: 1, reason: '' }; // Reset form
      } catch (error) {
        console.error('Error submitting borrow request:', error);
        alert('Failed to submit borrow request. Please try again.');
      }
    },

    async login() {
      const auth = getAuth();
      try {
        const userCredential = await signInWithEmailAndPassword(auth, this.loginForm.email, this.loginForm.password);
        const user = userCredential.user;
        this.isLoggedIn = true;
        this.userName = user.displayName || user.email.split('@')[0];
        this.userRole = user.email.includes('admin') ? 'admin' : user.email.includes('manager') ? 'manager' : 'user';
        this.showLoginModal = false;
      } catch (error) {
        console.error('Login failed:', error);
        alert('Failed to login. Please check your credentials.');
      }
    },

    async logout() {
      const auth = getAuth();
      try {
        await signOut(auth); // Logs the user out from Firebase
        this.isLoggedIn = false;
        this.userName = '';
        this.userRole = 'user';
        this.isProfileOpen = false;
        alert('Successfully logged out.');
      } catch (error) {
        console.error('Logout failed:', error);
        alert('Failed to logout. Please try again.');
      }
    },
  }
}
</script>

<style scoped>
.transition {
  transition: all 0.3s ease;
}
</style>