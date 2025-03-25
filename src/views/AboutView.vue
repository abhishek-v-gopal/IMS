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
      
      <!-- About Section -->
      <section class="py-12 bg-white">
        <div class="container mx-auto px-4">
          <h2 class="text-3xl font-bold text-gray-800 mb-8">About Inovus Labs IEDC</h2>
          <p class="text-lg text-gray-600 mb-4">
            Inovus Labs IEDC is a community where students can borrow electronic components for their projects. Our mission is to provide students with the resources they need to innovate and create.
          </p>
          <p class="text-lg text-gray-600 mb-4">
            We offer a wide range of components, from microcontrollers to sensors, to help students bring their ideas to life. Our inventory is constantly updated to ensure that we have the latest and most popular components available.
          </p>
          <p class="text-lg text-gray-600 mb-4">
            Our team is dedicated to supporting students in their projects and helping them succeed. Whether you are working on a class project, a personal project, or a competition, we are here to help.
          </p>
          <p class="text-lg text-gray-600">
            Join us and be a part of a community of innovators and creators. Let's build something amazing together!
          </p>
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
    name: 'AboutView',
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