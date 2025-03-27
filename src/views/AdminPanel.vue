<template>
    <div class="min-h-screen bg-gray-50">
        <!-- Header -->
        <NavBar :isLoggedIn="isLoggedIn" :userName="userName" :userRole="userRole" :userInitials="userInitials"
            :isMobileMenuOpen="isMobileMenuOpen" :isProfileOpen="isProfileOpen"
            @show-login-modal="showLoginModal = true" @logout="logout" />

        <!-- Admin Panel Content -->
        <section class="py-12 bg-white">
            <div class="container mx-auto px-4">
                <h2 class="text-3xl font-bold text-gray-800 mb-8">Admin Panel</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                        <h3 class="text-lg font-medium text-gray-800 mb-2">Manage staff</h3>
                        <p class="text-gray-600 mb-4">Oversee and control managerial roles efficiently.</p>
                        <a href="/managestaff" class="text-purple-600 font-medium hover:text-purple-700">Manage Now →</a>
                    </div>

                </div>

                <!-- Admin Data Table -->
                <div class="mt-12 bg-white rounded-lg shadow-sm overflow-hidden">
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
                </div>
            </div>
        </section>

        <!-- Footer -->
        <Footer />
    </div>
</template> 

<script>
import NavBar from '../components/NavBar.vue'
import Footer from '../components/Footer.vue'
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase/config";

export default {
    name: 'AdminPanel',
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
            adminData: [],
            newAdmin: { name: "", role: "admin" },
            isEditing: false,
            editingAdminId: null,
        }
    },
    async created() {
        await this.fetchAdminData();
    },
    computed: {
        userInitials() {
            if (!this.userName) return ''
            return this.userName.split(' ').map(n => n[0]).join('').toUpperCase()
        }
    },
    methods: {
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