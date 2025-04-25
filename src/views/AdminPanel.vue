<template>
    <div class="min-h-screen bg-gray-50">
        <!-- Header -->
        <NavBar :isLoggedIn="isLoggedIn" :userName="userName" :userRole="userRole" :userInitials="userInitials"
            :isMobileMenuOpen="isMobileMenuOpen" :isProfileOpen="isProfileOpen"
            @show-login-modal="showLoginModal = true" @logout="logout" />

        <!-- Admin Check Component -->
        <AdminCheck requiredRole="admin" />

        <!-- Admin Panel Content -->
        <section class="py-12 bg-white">
            <div class="container mx-auto px-4">
                <h2 class="text-3xl font-bold text-gray-800 mb-8">Admin Panel</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                    <div class="bg-emerald-50 p-6 rounded-lg border border-emerald-100">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-emerald-600 mb-4" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <h3 class="text-lg font-medium text-gray-800 mb-2">Add New Component</h3>
                        <p class="text-gray-600 mb-4">Add a new component to the inventory system.</p>
                        <a href="/addcomponent" class="text-emerald-600 font-medium hover:text-emerald-700">Add Component →</a>
                    </div>
                    <div class="bg-red-100 p-6 rounded-lg border border-emerald-100">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-emerald-600 mb-4" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <h3 class="text-lg font-medium text-gray-800 mb-2">Sales</h3>
                        <p class="text-gray-600 mb-4">Add new items and manage orders.</p>
                        <div class="flex flex-col space-y-2">
                            <a href="/admin/products" class="text-emerald-600 font-medium hover:text-emerald-700">Add products →</a>
                            <a href="/admin/orders" class="text-emerald-600 font-medium hover:text-emerald-700">Manage orders →</a>
                            <p class="text-xs text-red-600 mt-1">* Admin access only</p>
                        </div>
                    </div>
                    <div class="bg-blue-50 p-6 rounded-lg border border-blue-100">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-blue-600 mb-4" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <h3 class="text-lg font-medium text-gray-800 mb-2">Manage Requests</h3>
                        <p class="text-gray-600 mb-4">View and manage pending borrow requests.</p>
                        <a href="/managerequest" class="text-blue-600 font-medium hover:text-blue-700">View Requests →</a>
                    </div>
                    <div class="bg-purple-50 p-6 rounded-lg border border-purple-100">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-purple-600 mb-4" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h3 class="text-lg font-medium text-gray-800 mb-2">Manage users</h3>
                        <p class="text-gray-600 mb-4">Oversee and control managerial roles efficiently.</p>
                        <a href="/managestaff" class="text-purple-600 font-medium hover:text-purple-700">Manage Now →</a>
                    </div>

                </div>

                <!-- Admin Access Warning -->
                <div class="mt-8 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <div class="flex items-start">
                        <div class="flex-shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <div class="ml-3">
                            <h3 class="text-sm font-medium text-yellow-800">Admin Access Notice</h3>
                            <div class="mt-2 text-sm text-yellow-700">
                                <p>Some pages like Order Management and Product Management are restricted to admin users only. 
                                   Non-admin users attempting to access these pages will be redirected to the homepage.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Admin Data Table -->
                <!-- <div class="mt-12 bg-white rounded-lg shadow-sm overflow-hidden">
                    <h3 class="text-xl font-bold text-gray-800 px-6 py-4 border-b">Admin Data</h3>
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <tr v-for="admin in adminData" :key="admin.id" class="hover:bg-gray-50">
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm font-medium text-gray-900">{{ admin.name }}</div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm text-gray-500">{{ admin.role }}</div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button @click="editAdmin(admin)" class="text-blue-600 hover:text-blue-900 mr-4">Edit</button>
                                    <button @click="deleteAdmin(admin.id)" class="text-red-600 hover:text-red-900">Delete</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div> -->
            </div>
        </section>

        <!-- Footer -->
        <Footer />
        
        <!-- Unauthorized Access Modal -->
        <div v-if="showUnauthorizedModal" class="fixed inset-0 bg-black/85 flex items-center justify-center z-50">
            <div class="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                <div class="flex justify-between items-start mb-4">
                    <h3 class="text-xl font-bold text-gray-800">Unauthorized Access</h3>
                </div>
                <div class="space-y-4">
                    <div class="flex justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-20 w-20 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <p class="text-center text-gray-700 mb-4">You do not have permission to access the Admin Panel. This area is restricted to administrators only.</p>
                    <div class="flex justify-center">
                        <button @click="goToHomePage" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                            Go Back to Home
                        </button>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Not Logged In Modal -->
        <div v-if="showNotLoggedInModal" class="fixed inset-0 bg-black/85 flex items-center justify-center z-50">
            <div class="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                <div class="flex justify-between items-start mb-4">
                    <h3 class="text-xl font-bold text-gray-800">Authentication Required</h3>
                </div>
                <div class="space-y-4">
                    <div class="flex justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-20 w-20 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <p class="text-center text-gray-700 mb-4">You need to be logged in to access the Admin Panel. Please log in to continue.</p>
                    <div class="flex justify-center gap-4">
                        <button @click="goToHomePage" class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500">
                            Go Back to Home
                        </button>
                        <button @click="showLoginForm" class="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                            Log In
                        </button>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Login Modal Component -->
        <LoginModal 
            :show="showLoginModal" 
            @close="showLoginModal = false" 
            @login-success="handleLoginSuccess" 
            @show-registration="goToRegistration"
        />
    </div>
</template> 

<script>
import NavBar from '../components/NavBar.vue'
import Footer from '../components/Footer.vue'
import AdminCheck from '../components/AdminCheck.vue'
import LoginModal from '../components/LoginModal.vue'
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../firebase/config";

export default {
    name: 'AdminPanel',
    components: {
        NavBar,
        Footer,
        AdminCheck,
        LoginModal
    },
    data() {
        return {
            isLoggedIn: false,
            userName: '',
            userRole: '',
            isMobileMenuOpen: false,
            isProfileOpen: false,
            showLoginModal: false,
            showNotLoggedInModal: false,
            adminData: [],
            newAdmin: { name: "", role: "admin" },
            isEditing: false,
            editingAdminId: null,
            currentUserId: null,
            showUnauthorizedModal: false,
        }
    },
    async created() {
        await this.getCurrentUserId();
        if (this.currentUserId) {
            await this.fetchCurrentUser();
            await this.fetchAdminData();
            this.checkUserPermissions();
        } else {
            console.log("No user is logged in!");
            // Show not logged in modal
            this.showNotLoggedInModal = true;
        }
    },
    computed: {
        userInitials() {
            if (!this.userName) return ''
            return this.userName.split(' ').map(n => n[0]).join('').toUpperCase()
        }
    },
    methods: {
        async getCurrentUserId() {
            const auth = getAuth();
            
            // Return a Promise to allow awaiting the auth state
            return new Promise((resolve) => {
                onAuthStateChanged(auth, (user) => {
                    if (user) {
                        // User is signed in
                        this.currentUserId = user.uid;
                        console.log("Current user ID:", user.uid);
                        this.isLoggedIn = true;
                        resolve(user.uid);
                    } else {
                        // User is signed out
                        this.currentUserId = null;
                        this.isLoggedIn = false;
                        resolve(null);
                    }
                });
            });
        },
        
        async fetchCurrentUser() {
            try {
                if (!this.currentUserId) {
                    console.log("No user ID available!");
                    this.isLoggedIn = false;
                    return null;
                }
                
                const userDoc = await getDoc(doc(db, "users", this.currentUserId));
                
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    this.isLoggedIn = true;
                    this.userName = userData.name || 'Anonymous User';
                    this.userRole = userData.role || 'user';
                    
                    // Log the user role to console
                    console.log("Current user role:", this.userRole);
                    
                    return userData;
                } else {
                    console.log("No user document found!");
                    this.isLoggedIn = false;
                    return null;
                }
            } catch (error) {
                console.error("Error fetching current user:", error);
                this.isLoggedIn = false;
                return null;
            }
        },
        
        checkUserPermissions() {
            console.log("Checking permissions for role:", this.userRole);
            
            // Check if user has admin access
            if (this.userRole === 'admin') {
                console.log("User has full admin permissions");
            } else if (this.userRole === 'manager') {
                console.log("User has manager permissions - limited admin access");
                // Show unauthorized modal for managers too - uncomment if you want only admins
                // this.showUnauthorizedModal = true;
            } else {
                console.log("User does not have admin permissions");
                // Show unauthorized access modal
                this.showUnauthorizedModal = true;
            }
        },
        
        goToHomePage() {
            // Navigate to home page
            this.$router.push('/');
        },
        
        showLoginForm() {
            // Hide the notification modal and show the login modal
            this.showNotLoggedInModal = false;
            this.showLoginModal = true;
        },
        
        handleLoginSuccess(user) {
            console.log("Login successful, updating UI", user);
            this.currentUserId = user.uid;
            this.isLoggedIn = true;
            // Fetch user data to get role and other info
            this.fetchCurrentUser().then(() => {
                // After fetching user data, check permissions and fetch admin data
                this.checkUserPermissions();
                this.fetchAdminData();
            });
        },
        
        goToRegistration() {
            // For now, redirect to home page for registration
            this.$router.push({ path: '/', query: { showRegistration: 'true' } });
        },
        
        logout() {
            this.isLoggedIn = false
            this.userRole = 'user'
            this.isProfileOpen = false
        },
        async fetchAdminData() {
            const snapshot = await getDocs(collection(db, "admins"));
            this.adminData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        },
        async addAdmin() {
            await addDoc(collection(db, "admins"), this.newAdmin);
            this.newAdmin = { name: "", role: "admin" };
            await this.fetchAdminData();
        },
        async editAdmin(admin) {
            this.isEditing = true;
            this.editingAdminId = admin.id;
            this.newAdmin = { ...admin };
        },
        async updateAdmin() {
            const adminDoc = doc(db, "admins", this.editingAdminId);
            await updateDoc(adminDoc, this.newAdmin);
            this.isEditing = false;
            this.editingAdminId = null;
            this.newAdmin = { name: "", role: "admin" };
            await this.fetchAdminData();
        },
        async deleteAdmin(adminId) {
            await deleteDoc(doc(db, "admins", adminId));
            await this.fetchAdminData();
        },
    }
}
</script>

<style scoped>
/* Any additional custom styles can go here */
.transition {
    transition: all 0.3s ease;
}
</style>