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
            <h1 class="text-2xl font-bold">Products for Sale</h1>
            <router-link 
                :to="{ path: '/orderhistory', query: { email: userEmail || '' }}" 
                class="bg-white border border-indigo-600 text-indigo-600 py-2 px-4 rounded-md hover:bg-indigo-50 transition flex items-center"
            >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Your Orders
            </router-link>
        </div>
        
        <!-- Product List -->
        <div v-if="loading" class="text-center py-8">
            <p class="text-lg">Loading products...</p>
        </div>
        
        <div v-else-if="products.length === 0" class="text-center py-8">
            <p class="text-lg">No products available at the moment.</p>
        </div>
        
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <div v-for="product in products" :key="product.id" class="bg-white rounded-lg shadow-md overflow-hidden">
                <img 
                    v-if="product.imageUrl" 
                    :src="product.imageUrl" 
                    :alt="product.name" 
                    class="w-full h-56 object-cover"
                />
                <div v-else class="w-full h-56 bg-gray-200 flex items-center justify-center">
                    <span class="text-gray-500">No image available</span>
                </div>
                
                <div class="p-6">
                    <h2 class="text-xl font-semibold mb-2">{{ product.name }}</h2>
                    <p class="text-gray-600 mb-4">{{ product.description }}</p>
                    <p class="text-2xl font-bold text-indigo-600 mb-4">₹{{ product.price.toFixed(2) }}</p>
                    
                    <button 
                        @click="selectProduct(product)"
                        class="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition"
                    >
                        Order Now
                    </button>
                </div>
            </div>
        </div>
        
        <!-- Order Modal -->
        <div v-if="showOrderModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div class="bg-white rounded-lg shadow-xl max-w-md w-full my-8 mx-auto max-h-[80vh] md:max-h-[90vh] flex flex-col">
                <div class="p-6 flex-shrink-0 border-b">
                    <div class="flex justify-between items-center">
                        <h2 class="text-xl font-bold">Place Order</h2>
                        <button @click="showOrderModal = false" class="text-gray-500 hover:text-gray-700">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentStroke">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
                
                <div class="overflow-y-auto p-6 flex-grow">
                    <div v-if="selectedProduct" class="mb-6">
                        <div class="flex items-center mb-4">
                            <img 
                                v-if="selectedProduct.imageUrl" 
                                :src="selectedProduct.imageUrl" 
                                :alt="selectedProduct.name" 
                                class="w-20 h-20 object-cover rounded mr-4" 
                            />
                            <div>
                                <h3 class="font-semibold">{{ selectedProduct.name }}</h3>
                                <p class="text-indigo-600 font-bold">₹{{ selectedProduct.price.toFixed(2) }}</p>
                            </div>
                        </div>
                        
                        <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                            <div class="flex">
                                <div class="flex-shrink-0">
                                    <svg class="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                                    </svg>
                                </div>
                                <div class="ml-3">
                                    <p class="text-sm text-yellow-700">
                                        Please make payment to UPI ID: <strong>example@upi</strong> before submitting your order. Attach the payment screenshot below.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <form @submit.prevent="submitOrder" class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Full Name</label>
                            <input 
                                v-model="orderForm.name" 
                                type="text" 
                                required
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                            <p v-if="formErrors.name" class="mt-1 text-sm text-red-600">{{ formErrors.name }}</p>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Email Address</label>
                            <div v-if="userEmail" class="mt-1">
                                <input 
                                    :value="userEmail" 
                                    type="email" 
                                    readonly
                                    class="w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                                <p class="mt-1 text-xs text-gray-500">Your orders will be associated with this email address</p>
                            </div>
                            <input 
                                v-else
                                v-model="orderForm.email" 
                                type="email" 
                                required
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                            <p v-if="formErrors.email" class="mt-1 text-sm text-red-600">{{ formErrors.email }}</p>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Phone Number</label>
                            <input 
                                v-model="orderForm.phone" 
                                type="tel" 
                                required
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                            <p v-if="formErrors.phone" class="mt-1 text-sm text-red-600">{{ formErrors.phone }}</p>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Delivery Address</label>
                            <textarea 
                                v-model="orderForm.address" 
                                required
                                rows="3"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            ></textarea>
                            <p v-if="formErrors.address" class="mt-1 text-sm text-red-600">{{ formErrors.address }}</p>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Payment Screenshot</label>
                            <input 
                                @change="handlePaymentScreenshot" 
                                type="file" 
                                accept="image/*"
                                required
                                class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                            />
                            <p v-if="formErrors.screenshot" class="mt-1 text-sm text-red-600">{{ formErrors.screenshot }}</p>
                            <div v-if="screenshotPreview" class="mt-2">
                                <img :src="screenshotPreview" alt="Payment Screenshot" class="h-32 object-contain rounded-md" />
                            </div>
                        </div>
                    </form>
                </div>
                
                <div class="p-4 border-t flex-shrink-0">
                    <button 
                        @click="submitOrder" 
                        class="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
                        :disabled="isSubmitting"
                    >
                        <span v-if="isSubmitting">Processing...</span>
                        <span v-else>Submit Order</span>
                    </button>
                </div>
            </div>
        </div>
        
        <!-- Success Modal -->
        <div v-if="showSuccessModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
                <div class="p-6 text-center">
                    <svg class="mx-auto h-12 w-12 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <h3 class="text-lg font-medium text-gray-900 mt-4">Order Placed Successfully!</h3>
                    <p class="text-sm text-gray-600 mt-2">
                        Your order has been received. We'll process it and contact you soon.
                    </p>
                    <button 
                        @click="showSuccessModal = false" 
                        class="mt-6 inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none"
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        </div>
    </div>
    
    <Footer/>
</template>

<script>
import NavBar from '../components/NavBar.vue'
import Footer from '../components/Footer.vue'
import { collection, getDocs, addDoc } from 'firebase/firestore'
import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { db } from '../firebase/config' // Ensure you have this firebase config file

export default {
    name: 'ProductView',
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
            
            // Products
            products: [],
            loading: true,
            
            // Order
            showOrderModal: false,
            selectedProduct: null,
            orderForm: {
                name: '',
                email: '',
                phone: '',
                address: '',
                screenshotFile: null
            },
            screenshotPreview: null,
            formErrors: {
                name: '',
                email: '',
                phone: '',
                address: '',
                screenshot: ''
            },
            isSubmitting: false,
            showSuccessModal: false,
            
            // Add userEmail
            userEmail: ''
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
        
        // Get user email from localStorage if available
        const savedEmail = localStorage.getItem('userEmail')
        if (savedEmail) {
            this.userEmail = savedEmail
            // Don't set orderForm.email here - we'll set it when the form opens
        }
    },
    methods: {
        logout() {
            this.isLoggedIn = false
            this.userRole = 'user'
            this.isProfileOpen = false
        },
        
        async fetchProducts() {
            this.loading = true
            try {
                const querySnapshot = await getDocs(collection(db, 'salesProducts'))
                this.products = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }))
            } catch (error) {
                console.error('Error fetching products:', error)
            } finally {
                this.loading = false
            }
        },
        
        selectProduct(product) {
            this.selectedProduct = product
            this.showOrderModal = true
            
            // Pre-fill form with saved data if available
            const savedEmail = localStorage.getItem('userEmail')
            if (savedEmail) {
                this.userEmail = savedEmail
                this.orderForm.email = savedEmail  // Set the email in the form
            } else {
                // Clear the email field if no saved email
                this.orderForm.email = ''
            }
            
            if (this.isLoggedIn) {
                this.orderForm.name = this.userName
            }
        },
        
        handlePaymentScreenshot(event) {
            const file = event.target.files[0]
            if (!file) return
            
            // Validate file type
            if (!file.type.match('image.*')) {
                this.formErrors.screenshot = 'Please select an image file'
                return
            }
            
            this.orderForm.screenshotFile = file
            
            // Create preview
            const reader = new FileReader()
            reader.onload = e => {
                this.screenshotPreview = e.target.result
            }
            reader.readAsDataURL(file)
        },
        
        validateOrderForm() {
            let isValid = true
            this.formErrors = {
                name: '',
                email: '',
                phone: '',
                address: '',
                screenshot: ''
            }
            
            if (!this.orderForm.name.trim()) {
                this.formErrors.name = 'Name is required'
                isValid = false
            }
            
            if (!this.orderForm.email.trim()) {
                this.formErrors.email = 'Email is required'
                isValid = false
            } else if (!/\S+@\S+\.\S+/.test(this.orderForm.email)) {
                this.formErrors.email = 'Please enter a valid email address'
                isValid = false
            }
            
            if (!this.orderForm.phone.trim()) {
                this.formErrors.phone = 'Phone number is required'
                isValid = false
            } else if (!/^\d{10}$/.test(this.orderForm.phone.replace(/\D/g, ''))) {
                this.formErrors.phone = 'Please enter a valid 10-digit phone number'
                isValid = false
            }
            
            if (!this.orderForm.address.trim()) {
                this.formErrors.address = 'Delivery address is required'
                isValid = false
            }
            
            if (!this.orderForm.screenshotFile) {
                this.formErrors.screenshot = 'Payment screenshot is required'
                isValid = false
            }
            
            return isValid
        },
        
        async uploadScreenshot() {
            if (!this.orderForm.screenshotFile) return null
            
            const storage = getStorage()
            const fileRef = storageRef(storage, `orders/${Date.now()}_payment_${this.orderForm.screenshotFile.name}`)
            
            const uploadTask = uploadBytesResumable(fileRef, this.orderForm.screenshotFile)
            
            return new Promise((resolve, reject) => {
                uploadTask.on('state_changed', 
                    null,
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
        
        async submitOrder() {
            if (!this.validateOrderForm()) return
            
            // Use the email from the form if userEmail is empty
            // Otherwise use the userEmail (from localStorage)
            const orderEmail = this.userEmail || this.orderForm.email
            
            this.isSubmitting = true
            
            try {
                // Upload payment screenshot
                const screenshotUrl = await this.uploadScreenshot()
                
                // Prepare order data
                const orderData = {
                    productId: this.selectedProduct.id,
                    productName: this.selectedProduct.name,
                    productPrice: this.selectedProduct.price,
                    customerName: this.orderForm.name,
                    customerEmail: orderEmail, // Use the email we determined above
                    customerPhone: this.orderForm.phone,
                    deliveryAddress: this.orderForm.address,
                    paymentScreenshotUrl: screenshotUrl,
                    status: 'pending', // pending, processing, shipped, delivered, cancelled
                    orderedAt: new Date()
                }
                
                // Save to Firestore
                await addDoc(collection(db, 'salesOrders'), orderData)
                
                // Save email to localStorage for future use
                localStorage.setItem('userEmail', orderEmail)
                this.userEmail = orderEmail
                
                // Show success modal and reset form
                this.orderForm = {
                    name: '',
                    email: '',
                    phone: '',
                    address: '',
                    screenshotFile: null
                }
                this.screenshotPreview = null
                this.showOrderModal = false
                this.showSuccessModal = true
            } catch (error) {
                console.error('Error placing order:', error)
                alert('Failed to place order. Please try again.')
            } finally {
                this.isSubmitting = false
            }
        }
    }
}
</script>