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

  <!-- Admin Check Component -->
  <AdminCheck requiredRole="admin" />

  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Product Management</h1>
      
      <router-link 
        v-if="userRole === 'admin'"
        to="/admin/orders" 
        class="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition flex items-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        Manage Orders
      </router-link>
    </div>
    
  
    
    <!-- Admin Product Management Section -->
    <div v-if="userRole === 'admin'" class="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 class="text-xl font-semibold mb-4">Add New Product</h2>
      
      <form @submit.prevent="addProduct" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Product Name</label>
          <input 
            v-model="newProduct.name" 
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            type="text"
          />
          <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700">Description</label>
          <textarea 
            v-model="newProduct.description" 
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            rows="3"
          ></textarea>
          <p v-if="errors.description" class="mt-1 text-sm text-red-600">{{ errors.description }}</p>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700">Price</label>
          <input 
            v-model="newProduct.price" 
            required
            type="number" 
            min="0" 
            step="0.01"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          <p v-if="errors.price" class="mt-1 text-sm text-red-600">{{ errors.price }}</p>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700">Product Image</label>
          <input 
            @change="handleImageUpload" 
            type="file" 
            accept="image/*"
            class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
          <p v-if="errors.image" class="mt-1 text-sm text-red-600">{{ errors.image }}</p>
          <div v-if="imagePreview" class="mt-2">
            <img :src="imagePreview" alt="Preview" class="h-32 w-32 object-cover rounded-md" />
          </div>
          <div v-if="uploadProgress > 0 && uploadProgress < 100" class="mt-2">
            <div class="bg-gray-200 rounded-full h-2.5">
              <div class="bg-indigo-600 h-2.5 rounded-full" :style="{width: uploadProgress + '%'}"></div>
            </div>
            <p class="text-sm text-gray-600 mt-1">Uploading: {{ uploadProgress }}%</p>
          </div>
        </div>
        
        <div>
          <button 
            type="submit" 
            class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            :disabled="isSubmitting"
          >
            <span v-if="isSubmitting">Adding...</span>
            <span v-else>Add Product</span>
          </button>
        </div>
      </form>
    </div>
    
    <!-- Product List -->
    <div class="bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-xl font-semibold mb-4">Products for Sale</h2>
      
      <div v-if="loading" class="text-center py-4">
        <p>Loading products...</p>
      </div>
      
      <div v-else-if="products.length === 0" class="text-center py-4">
        <p>No products available.</p>
      </div>
      
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="product in products" :key="product.id" class="border rounded-lg overflow-hidden">
          <img v-if="product.imageUrl" :src="product.imageUrl" alt="Product" class="w-full h-48 object-cover" />
          <div class="p-4">
            <h3 class="font-bold text-lg">{{ product.name }}</h3>
            <p class="text-gray-700 mt-1">{{ product.description }}</p>
            <p class="text-indigo-600 font-bold mt-2">₹{{ product.price.toFixed(2) }}</p>
            
            <div v-if="userRole === 'admin'" class="mt-4 flex space-x-2">
              <button 
                @click="deleteProduct(product.id)" 
                class="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <Footer/>
</template>

<script>
import NavBar from '../components/NavBar.vue'
import Footer from '../components/Footer.vue'
import AdminCheck from '../components/AdminCheck.vue'
import { collection, addDoc, getDocs, deleteDoc, doc, onSnapshot } from 'firebase/firestore'
import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { db } from '../firebase/config' // Ensure you have this firebase config file

export default {
  name: 'SaleComponent',
  components: {
    NavBar,
    Footer,
    AdminCheck
  },
  data() {
    return {
      isLoggedIn: false,
      userName: 'John Doe',
      userRole: 'admin', // Changed default for testing, use 'user' in production
      isMobileMenuOpen: false,
      isProfileOpen: false,
      showLoginModal: false,
      
      // Product management
      newProduct: {
        name: '',
        description: '',
        price: '',
        imageUrl: ''
      },
      imageFile: null,
      imagePreview: null,
      uploadProgress: 0,
      isSubmitting: false,
      products: [],
      loading: true,
      errors: {
        name: '',
        description: '',
        price: '',
        image: ''
      }
    }
  },
  computed: {
    userInitials() {
      if (!this.userName) return ''
      return this.userName.split(' ').map(n => n[0]).join('').toUpperCase()
    }
  },
  mounted() {
    this.fetchProducts()
  },
  methods: {
    logout() {
      this.isLoggedIn = false
      this.userRole = 'user'
      this.isProfileOpen = false
    },
    
    validateForm() {
      let isValid = true
      this.errors = {
        name: '',
        description: '',
        price: '',
        image: ''
      }
      
      if (!this.newProduct.name.trim()) {
        this.errors.name = 'Product name is required'
        isValid = false
      }
      
      if (!this.newProduct.description.trim()) {
        this.errors.description = 'Description is required'
        isValid = false
      }
      
      if (!this.newProduct.price || isNaN(this.newProduct.price) || this.newProduct.price <= 0) {
        this.errors.price = 'Please enter a valid price greater than 0'
        isValid = false
      }
      
      return isValid
    },
    
    handleImageUpload(event) {
      const file = event.target.files[0]
      if (!file) return
      
      // Validate file type
      if (!file.type.match('image.*')) {
        this.errors.image = 'Please select an image file'
        return
      }
      
      this.imageFile = file
      
      // Create preview
      const reader = new FileReader()
      reader.onload = e => {
        this.imagePreview = e.target.result
      }
      reader.readAsDataURL(file)
    },
    
    async uploadImage() {
      if (!this.imageFile) return null
      
      const storage = getStorage()
      const fileRef = storageRef(storage, `products/${Date.now()}_${this.imageFile.name}`)
      
      const uploadTask = uploadBytesResumable(fileRef, this.imageFile)
      
      return new Promise((resolve, reject) => {
        uploadTask.on('state_changed', 
          (snapshot) => {
            this.uploadProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          },
          (error) => {
            console.error('Upload failed:', error)
            reject(error)
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
            resolve(downloadURL)
          }
        )
      })
    },
    
    async addProduct() {
      if (!this.validateForm()) return
      
      this.isSubmitting = true
      
      try {
        let imageUrl = null
        
        if (this.imageFile) {
          imageUrl = await this.uploadImage()
        }
        
        const productData = {
          name: this.newProduct.name,
          description: this.newProduct.description,
          price: parseFloat(this.newProduct.price),
          imageUrl: imageUrl,
          createdAt: new Date()
        }
        
        await addDoc(collection(db, 'salesProducts'), productData)
        
        // Reset form
        this.newProduct = {
          name: '',
          description: '',
          price: '',
          imageUrl: ''
        }
        this.imageFile = null
        this.imagePreview = null
        this.uploadProgress = 0
        
        alert('Product added successfully!')
      } catch (error) {
        console.error('Error adding product:', error)
        alert('Failed to add product. Please try again.')
      } finally {
        this.isSubmitting = false
      }
    },
    
    async fetchProducts() {
      this.loading = true
      try {
        const productsRef = collection(db, 'salesProducts')
        
        // Set up real-time listener
        onSnapshot(productsRef, (snapshot) => {
          this.products = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          this.loading = false
        })
      } catch (error) {
        console.error('Error fetching products:', error)
        this.loading = false
      }
    },
    
    async deleteProduct(productId) {
      if (!confirm('Are you sure you want to delete this product?')) return
      
      try {
        await deleteDoc(doc(db, 'salesProducts', productId))
        alert('Product deleted successfully')
      } catch (error) {
        console.error('Error deleting product:', error)
        alert('Failed to delete product')
      }
    }
  }
}
</script>