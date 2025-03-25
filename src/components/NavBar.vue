<template>
  <header class="bg-white shadow">
    <div class="container mx-auto px-4 py-4 flex justify-between items-center">
      <div class="flex items-center">
        <div class="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold mr-3">IL</div>
        <h1 class="text-xl font-bold text-gray-800">Inovus Labs IEDC</h1>
      </div>
      <nav class="hidden md:flex space-x-6">
        <a href="/" class="text-gray-700 hover:text-emerald-600 transition">Home</a>
        <a href="/components" class="text-gray-700 hover:text-emerald-600 transition">Components</a>
        <a href="/borrow" class="text-gray-700 hover:text-emerald-600 transition">My Borrows</a>
        <a href="/about" class="text-gray-700 hover:text-emerald-600 transition">About</a>
      </nav>
      <div class="flex items-center space-x-4">
        <button v-if="!isLoggedIn" @click="$emit('show-login-modal')" class="px-4 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 transition">
          Login
        </button>
        <div v-else class="relative">
          <button @click="isProfileOpen = !isProfileOpen" class="flex items-center space-x-2">
            <div class="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-800">
              {{ userInitials }}
            </div>
            <span class="hidden md:inline text-sm font-medium">{{ userName }}</span>
          </button>
          <div v-if="isProfileOpen" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
            <div class="px-4 py-2 text-sm text-gray-700 border-b">
              Logged in as <span class="font-semibold">{{ userRole }}</span>
            </div>
            <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</a>
            <a href="#" v-if="userRole === 'admin'" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Admin Dashboard</a>
            <a href="#" v-if="userRole === 'manager' || userRole === 'admin'" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Manage Inventory</a>
            <a href="#" @click="$emit('logout')" class="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Logout</a>
          </div>
        </div>
        <button class="md:hidden" @click="isMobileMenuOpen = !isMobileMenuOpen">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </div>
    <!-- Mobile menu -->
    <div v-if="isMobileMenuOpen" class="md:hidden bg-white border-t">
      <div class="px-2 pt-2 pb-3 space-y-1">
        <a href="#" class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50">Home</a>
        <a href="#" class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50">Components</a>
        <a href="#" class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50">My Borrows</a>
        <a href="#" class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50">About</a>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'NavBar',
  props: {
    isLoggedIn: Boolean,
    userName: String,
    userRole: String,
    userInitials: String,
    isMobileMenuOpen: Boolean,
    isProfileOpen: Boolean
  },
  emits: ['show-login-modal', 'logout']
}
</script>

