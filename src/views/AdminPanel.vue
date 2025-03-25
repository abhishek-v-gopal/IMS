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
                        <button class="text-emerald-600 font-medium hover:text-emerald-700">Add Component →</button>
                    </div>
                    <div class="bg-blue-50 p-6 rounded-lg border border-blue-100">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-blue-600 mb-4" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <h3 class="text-lg font-medium text-gray-800 mb-2">Manage Requests</h3>
                        <p class="text-gray-600 mb-4">View and manage pending borrow requests.</p>
                        <button class="text-blue-600 font-medium hover:text-blue-700">View Requests →</button>
                    </div>
                    <div class="bg-purple-50 p-6 rounded-lg border border-purple-100">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-purple-600 mb-4" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h3 class="text-lg font-medium text-gray-800 mb-2">Manage Managers</h3>
                        <p class="text-gray-600 mb-4">Oversee and control managerial roles efficiently.</p>
                        <button class="text-purple-600 font-medium hover:text-purple-700">Manage Now →</button>
                    </div>

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
            showLoginModal: false
        }
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
        }
    }
}
</script>

<style scoped>
/* Any additional custom styles can go here */
.transition {
    transition: all 0.3s ease;
}
</style>