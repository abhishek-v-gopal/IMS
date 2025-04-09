<template>
    <div class="bg-gray-50">
      <!-- Header (reusing the same header structure) -->
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
  
      <!-- Login Required Message (if not logged in) -->
      <div v-if="!isLoggedIn" class="container mx-auto px-4 py-16 text-center">
        <div class="max-w-md mx-auto bg-white rounded-lg shadow-sm p-8">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-emerald-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <h2 class="text-2xl font-bold text-gray-800 mb-2">Login Required</h2>
          <p class="text-gray-600 mb-6">Please login to view your borrowed components and borrowing history.</p>
          <div class="flex space-x-4 justify-center">
            <button @click="showLoginModal = true" class="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition">
              Login
            </button>
            <button @click="showRegisterModal = true" class="px-4 py-2 bg-white border border-emerald-600 text-emerald-600 rounded-md hover:bg-emerald-50 transition">
              Register
            </button>
          </div>
        </div>
      </div>
  
      <!-- My Borrows Content (if logged in) -->
      <div v-if="isLoggedIn" class="container mx-auto px-4 py-8">
        <h1 class="text-2xl font-bold text-gray-800 mb-6">My Borrowed Components</h1>
        
        <!-- Tabs -->
        <div class="border-b border-gray-200 mb-6">
          <nav class="flex -mb-px">
            <button 
              @click="activeTab = 'current'" 
              :class="`py-4 px-6 font-medium text-sm border-b-2 ${activeTab === 'current' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`"
            >
              Currently Borrowed
            </button>
            <button 
              @click="activeTab = 'history'" 
              :class="`py-4 px-6 font-medium text-sm border-b-2 ${activeTab === 'history' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`"
            >
              Borrowing History
            </button>
          </nav>
        </div>
        
        <!-- Search and Filter -->
        <div class="mb-6">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div class="relative w-full md:w-96">
              <input 
                type="text" 
                placeholder="Search borrowed components..." 
                class="pl-10 pr-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                v-model="searchQuery"
              />
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            <div v-if="activeTab === 'current'" class="flex items-center">
              <span class="text-sm text-gray-500 mr-2">Sort by:</span>
              <select v-model="sortBy" class="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <option value="date-desc">Borrowed Date (Newest)</option>
                <option value="date-asc">Borrowed Date (Oldest)</option>
                <option value="due-date">Due Date</option>
                <option value="name">Component Name</option>
              </select>
            </div>
          </div>
        </div>
        
        <!-- Currently Borrowed Tab -->
        <div v-if="activeTab === 'current'">
          <!-- Stats Cards -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div class="bg-white p-4 rounded-lg shadow-sm">
              <div class="text-sm text-gray-500">Currently Borrowed</div>
              <div class="text-2xl font-bold text-gray-800">{{ filteredCurrentBorrows.length }}</div>
            </div>
            <div class="bg-white p-4 rounded-lg shadow-sm">
              <div class="text-sm text-gray-500">Due Soon</div>
              <div class="text-2xl font-bold text-amber-500">{{ dueSoonCount }}</div>
            </div>
            <div class="bg-white p-4 rounded-lg shadow-sm">
              <div class="text-sm text-gray-500">Overdue</div>
              <div class="text-2xl font-bold text-red-500">{{ overdueCount }}</div>
            </div>
          </div>
          
          <!-- No Borrows Message -->
          <div v-if="filteredCurrentBorrows.length === 0" class="bg-white rounded-lg shadow-sm p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <h3 class="text-lg font-medium text-gray-700 mb-2">No Components Borrowed</h3>
            <p class="text-gray-500 mb-4">You haven't borrowed any components yet.</p>
            <a href="#" class="inline-block px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition">
              Browse Components
            </a>
          </div>
          
          <!-- Borrowed Components List -->
          <div v-else class="space-y-4">
            <div 
              v-for="(borrow, index) in filteredCurrentBorrows" 
              :key="index" 
              class="bg-white rounded-lg shadow-sm overflow-hidden"
            >
              <div class="p-4 md:p-6 flex flex-col md:flex-row gap-4">
                <!-- Component Image -->
                <div class="w-full md:w-24 h-24 bg-gray-200 rounded-md flex items-center justify-center overflow-hidden shrink-0">
                  <img :src="borrow.component.image" :alt="borrow.component.name" class="max-h-full max-w-full object-contain" />
                </div>
                
                <!-- Component Details -->
                <div class="flex-1">
                  <div class="flex flex-col md:flex-row md:items-center justify-between mb-2">
                    <h3 class="text-lg font-medium text-gray-800">{{ borrow.component.name }}</h3>
                    <div :class="`px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(borrow.status)}`">
                      {{ borrow.status }}
                    </div>
                  </div>
                  <p class="text-sm text-gray-600 mb-4">{{ borrow.component.description }}</p>
                  
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <div class="text-gray-500">Borrowed On</div>
                      <div class="font-medium">{{ formatDate(borrow.borrowedDate) }}</div>
                    </div>
                    <div>
                      <div class="text-gray-500">Due Date</div>
                      <div class="font-medium" :class="isOverdue(borrow.dueDate) ? 'text-red-600' : ''">
                        {{ formatDate(borrow.dueDate) }}
                        <span v-if="isOverdue(borrow.dueDate)" class="text-red-600 text-xs ml-1">(Overdue)</span>
                        <span v-else-if="isDueSoon(borrow.dueDate)" class="text-amber-600 text-xs ml-1">(Due Soon)</span>
                      </div>
                    </div>
                    <div>
                      <div class="text-gray-500">Request ID</div>
                      <div class="font-medium">{{ borrow.requestId }}</div>
                    </div>
                  </div>
                </div>
                
                <!-- Actions -->
                <div class="flex md:flex-col justify-end gap-2 md:w-32 shrink-0">
                  <button 
                    @click="requestReturn(borrow)" 
                    class="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition text-sm"
                  >
                    Return Component
                  </button>
                  <button class="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition text-sm">
                    Request Extension
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Borrowing History Tab -->
        <div v-if="activeTab === 'history'">
          <!-- No History Message -->
          <div v-if="borrowHistory.length === 0" class="bg-white rounded-lg shadow-sm p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 class="text-lg font-medium text-gray-700 mb-2">No Borrowing History</h3>
            <p class="text-gray-500">You haven't borrowed any components in the past.</p>
          </div>
          
          <!-- History Table -->
          <div v-else class="bg-white rounded-lg shadow-sm overflow-hidden">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Component</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Borrowed Date</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Returned Date</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="(history, index) in filteredBorrowHistory" :key="index" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-md flex items-center justify-center overflow-hidden">
                        <img :src="history.component.image" :alt="history.component.name" class="max-h-full max-w-full object-contain" />
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">{{ history.component.name }}</div>
                        <div class="text-sm text-gray-500">ID: {{ history.requestId }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ formatDate(history.borrowedDate) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ formatDate(history.returnedDate) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ calculateDuration(history.borrowedDate, history.returnedDate) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="`px-2 py-1 text-xs rounded-full ${getStatusClass(history.status)}`">
                      {{ history.status }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
  
      <!-- Login Modal -->
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
              <input type="email" id="email" v-model="loginForm.email" class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input type="password" id="password" v-model="loginForm.password" class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <input type="checkbox" id="remember" v-model="loginForm.remember" class="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded" />
                <label for="remember" class="ml-2 block text-sm text-gray-700">Remember me</label>
              </div>
              <a href="#" class="text-sm text-emerald-600 hover:text-emerald-500">Forgot password?</a>
            </div>
            <button @click="login" class="w-full bg-emerald-600 text-white py-2 rounded-md hover:bg-emerald-700 transition">Login</button>
          </div>
          <div class="mt-4 text-center text-sm text-gray-600">
            Don't have an account? 
            <a href="#" @click="showLoginModal = false; showRegisterModal = true" class="text-emerald-600 hover:text-emerald-500">Register</a>
          </div>
        </div>
      </div>
  
      <!-- Register Modal -->
      <div v-if="showRegisterModal" class="fixed inset-0 bg-black/85 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-bold text-gray-800">Create an Account</h3>
            <button @click="showRegisterModal = false" class="text-gray-500 hover:text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label for="firstName" class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input type="text" id="firstName" v-model="registerForm.firstName" class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label for="lastName" class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input type="text" id="lastName" v-model="registerForm.lastName" class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
            </div>
            <div>
              <label for="registerEmail" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" id="registerEmail" v-model="registerForm.email" class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <label for="studentId" class="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
              <input type="text" id="studentId" v-model="registerForm.studentId" class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <label for="department" class="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <select id="department" v-model="registerForm.department" class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <option value="">Select Department</option>
                <option value="CSE">Computer Science</option>
                <option value="ECE">Electronics & Communication</option>
                <option value="EEE">Electrical & Electronics</option>
                <option value="ME">Mechanical Engineering</option>
                <option value="CE">Civil Engineering</option>
                <option value="IT">Information Technology</option>
              </select>
            </div>
            <div>
              <label for="registerPassword" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input type="password" id="registerPassword" v-model="registerForm.password" class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input type="password" id="confirmPassword" v-model="registerForm.confirmPassword" class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div class="flex items-center">
              <input type="checkbox" id="terms" v-model="registerForm.terms" class="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded" />
              <label for="terms" class="ml-2 block text-sm text-gray-700">
                I agree to the <a href="#" class="text-emerald-600 hover:text-emerald-500">Terms of Service</a> and <a href="#" class="text-emerald-600 hover:text-emerald-500">Privacy Policy</a>
              </label>
            </div>
            <button 
              @click="register" 
              class="w-full bg-emerald-600 text-white py-2 rounded-md hover:bg-emerald-700 transition"
            >
              Register
            </button>
          </div>
          <div class="mt-4 text-center text-sm text-gray-600">
            Already have an account? 
            <a href="#" @click="showRegisterModal = false; showLoginModal = true" class="text-emerald-600 hover:text-emerald-500">Login</a>
          </div>
        </div>
      </div>
    <div v-if="show" class="fixed inset-0 bg-black/85 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-bold text-gray-800">Create an Account</h3>
          <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        !-- Registration Form -->
        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="firstName" class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input 
                type="text" 
                id="firstName" 
                v-model="form.firstName" 
                class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                :class="{'border-red-500': errors.firstName}"
              />
              <p v-if="errors.firstName" class="mt-1 text-xs text-red-500">{{ errors.firstName }}</p>
            </div>
            <div>
              <label for="lastName" class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input 
                type="text" 
                id="lastName" 
                v-model="form.lastName" 
                class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                :class="{'border-red-500': errors.lastName}"
              />
              <p v-if="errors.lastName" class="mt-1 text-xs text-red-500">{{ errors.lastName }}</p>
            </div>
          </div>
          
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              id="email" 
              v-model="form.email" 
              class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              :class="{'border-red-500': errors.email}"
            />
            <p v-if="errors.email" class="mt-1 text-xs text-red-500">{{ errors.email }}</p>
          </div>
          
          <div>
            <label for="studentId" class="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
            <input 
              type="text" 
              id="studentId" 
              v-model="form.studentId" 
              class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              :class="{'border-red-500': errors.studentId}"
            />
            <p v-if="errors.studentId" class="mt-1 text-xs text-red-500">{{ errors.studentId }}</p>
          </div>
          
          <div>
            <label for="department" class="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <select 
              id="department" 
              v-model="form.department" 
              class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              :class="{'border-red-500': errors.department}"
            >
              <option value="">Select Department</option>
              <option value="CSE">Computer Science</option>
              <option value="ECE">Electronics & Communication</option>
              <option value="EEE">Electrical & Electronics</option>
              <option value="ME">Mechanical Engineering</option>
              <option value="CE">Civil Engineering</option>
              <option value="IT">Information Technology</option>
            </select>
            <p v-if="errors.department" class="mt-1 text-xs text-red-500">{{ errors.department }}</p>
          </div>
          
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              id="password" 
              v-model="form.password" 
              class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              :class="{'border-red-500': errors.password}"
            />
            <p v-if="errors.password" class="mt-1 text-xs text-red-500">{{ errors.password }}</p>
          </div>
          
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <input 
              type="password" 
              id="confirmPassword" 
              v-model="form.confirmPassword" 
              class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              :class="{'border-red-500': errors.confirmPassword}"
            />
            <p v-if="errors.confirmPassword" class="mt-1 text-xs text-red-500">{{ errors.confirmPassword }}</p>
          </div>
          
          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input 
              type="tel" 
              id="phone" 
              v-model="form.phone" 
              class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              :class="{'border-red-500': errors.phone}"
            />
            <p v-if="errors.phone" class="mt-1 text-xs text-red-500">{{ errors.phone }}</p>
          </div>
          
          <div class="flex items-center">
            <input 
              type="checkbox" 
              id="terms" 
              v-model="form.terms" 
              class="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
            />
            <label for="terms" class="ml-2 block text-sm text-gray-700">
              I agree to the <a href="#" class="text-emerald-600 hover:text-emerald-500">Terms of Service</a> and <a href="#" class="text-emerald-600 hover:text-emerald-500">Privacy Policy</a>
            </label>
          </div>
          <p v-if="errors.terms" class="mt-1 text-xs text-red-500">{{ errors.terms }}</p>
          
          &lt;!-- Registration Status -->
          <div v-if="status" :class="`p-3 rounded-md text-sm ${status.type === 'error' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`">
            {{ status.message }}
          </div>
          
          <button 
            @click="register" 
            class="w-full bg-emerald-600 text-white py-2 rounded-md hover:bg-emerald-700 transition"
            :disabled="isSubmitting"
          >
            <span v-if="isSubmitting" class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Registering...
            </span>
            <span v-else>Register</span>
          </button>
        </div>
        
        <div class="mt-4 text-center text-sm text-gray-600">
          Already have an account? 
          <a href="#" @click="$emit('switch-to-login')" class="text-emerald-600 hover:text-emerald-500">Login</a>
        </div>
      </div>
    </div>
    </div>
    <Footer/>
  </template>
  
  <script>
  import NavBar from '../components/NavBar.vue';
  import Footer from '../components/Footer.vue';
  import { collection, getDocs, doc, updateDoc, query, where, addDoc } from "firebase/firestore";
  import { db } from "../firebase/config";
  import { getAuth, onAuthStateChanged } from 'firebase/auth';

  export default {
    name: 'BorrowView',
    components: {
      NavBar,
      Footer
    },
    data() {
      return {
        isLoggedIn: false,
        userName: '',
        userRole: 'user',
        userInitials: '',
        userId: '',
        isMobileMenuOpen: false,
        isProfileOpen: false,
        showLoginModal: false,
        showRegisterModal: false,
        activeTab: 'current', // 'current' or 'history'
        searchQuery: '',
        sortBy: 'date-desc',
        currentBorrows: [],
        pendingRequests: [],
        borrowHistory: [],
        loading: {
          current: false,
          history: false
        },
        error: null
      };
    },
    async created() {
      this.initializeAuth();
    },
    methods: {
      initializeAuth() {
        const auth = getAuth();
        onAuthStateChanged(auth, async (user) => {
          if (user) {
            this.isLoggedIn = true;
            this.userName = user.displayName || user.email.split('@')[0];
            this.userInitials = this.userName.split(' ').map(n => n[0]).join('').toUpperCase();
            this.userRole = user.email.includes('admin') ? 'admin' : 'user';
            this.userId = user.uid;
            
            // Log user ID for debugging
            console.log("Current user ID:", this.userId);
            console.log("Current user details:", {
              name: this.userName,
              email: user.email,
              uid: user.uid,
              role: this.userRole
            });
            
            await this.fetchBorrowData(user.uid); // Fetch borrow data for the logged-in user
          } else {
            this.isLoggedIn = false;
            this.userName = '';
            this.userInitials = '';
            this.userId = '';
            this.currentBorrows = [];
            this.pendingRequests = [];
            this.borrowHistory = [];
          }
        });
      },
  
      async fetchBorrowData(userId) {
        if (!userId) return;
    
        try {
          this.loading.current = true;
          this.loading.history = true;
          
          // Log the user ID for which we're fetching data
          console.log("Fetching borrow data for user ID:", userId);
          
          // Create a query to filter borrows by userId - fix collection name to "borrowRequests"
          const borrowQuery = query(collection(db, 'borrowRequests'), where("userId", "==", userId));
          const borrowSnapshot = await getDocs(borrowQuery);
          
          console.log("Fetched data:", borrowSnapshot.docs.map(doc => doc.data()));
          
          const allBorrows = borrowSnapshot.docs.map(doc => ({ 
            id: doc.id,
            ...doc.data(),
            component: {
              name: doc.data().componentName || 'Unknown Component',
              image: 'https://via.placeholder.com/100', // Default image
              description: doc.data().reason || 'No description available'
            },
            // Set approvalDate and requestDate for proper display
            borrowedDate: doc.data().approvalDate || doc.data().requestDate,
            requestId: doc.id.substring(0, 8) // Use first 8 chars of document ID as request ID
          }));
    
          console.log("Processed borrow requests:", allBorrows);
    
          // Filter borrows based on their status
          this.currentBorrows = allBorrows.filter(borrow => 
            borrow.status === 'Approved' && !borrow.returned);
          
          this.pendingRequests = allBorrows.filter(borrow => 
            borrow.status === 'Pending');
          
          this.borrowHistory = allBorrows.filter(borrow => 
            (borrow.status === 'Approved' && borrow.returned) || 
            borrow.status === 'Rejected');
    
          console.log("Current borrows:", this.currentBorrows);
          console.log("Pending requests:", this.pendingRequests);
          console.log("Borrow history:", this.borrowHistory);
        } catch (error) {
          console.error('Error fetching borrow data:', error);
          this.error = error.message;
        } finally {
          this.loading.current = false;
          this.loading.history = false;
        }
      },
      
      async requestReturn(borrow) {
        try {
          // Log the user ID and borrow details before making the return request
          console.log("Requesting return for user ID:", this.userId);
          console.log("Borrow details:", borrow);
          
          const borrowDoc = doc(db, "borrowRequests", borrow.id);
          await updateDoc(borrowDoc, {
            status: "Return Requested",
            returnRequestDate: new Date()
          });
          borrow.status = "Return Requested"; // Update local state
          
          alert("Return request submitted successfully!");
          
          // Refresh data after updating
          if (this.userId) {
            await this.fetchBorrowData(this.userId);
          }
        } catch (error) {
          console.error("Error requesting return:", error);
          alert("Failed to submit return request. Please try again.");
        }
      },
  
      formatDate(date) {
        if (!date) return 'N/A';
        
        // Handle Firestore timestamp
        if (date && date.seconds) {
          date = new Date(date.seconds * 1000);
        } else if (typeof date === 'string') {
          date = new Date(date);
        }
        
        return date instanceof Date ? date.toLocaleDateString() : 'Invalid Date';
      },
  
      isOverdue(dueDate) {
        if (!dueDate) return false;
        
        // Handle Firestore timestamp
        let due;
        if (dueDate && dueDate.seconds) {
          due = new Date(dueDate.seconds * 1000);
        } else {
          due = new Date(dueDate);
        }
        
        return due < new Date();
      },
  
      isDueSoon(dueDate) {
        if (!dueDate) return false;
        
        // Handle Firestore timestamp
        let due;
        if (dueDate && dueDate.seconds) {
          due = new Date(dueDate.seconds * 1000);
        } else {
          due = new Date(dueDate);
        }
        
        const today = new Date();
        const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
        return diffDays <= 3 && diffDays > 0;
      },
  
      getStatusClass(status) {
        switch (status) {
          case 'Pending':
            return 'bg-amber-100 text-amber-800';
          case 'Approved':
            return 'bg-green-100 text-green-800';
          case 'Rejected':
            return 'bg-red-100 text-red-800';
          case 'Return Requested':
            return 'bg-blue-100 text-blue-800';
          case 'Overdue':
            return 'bg-red-100 text-red-800';
          default:
            return 'bg-gray-100 text-gray-800';
        }
      },
  
      calculateDuration(borrowedDate, returnedDate) {
        if (!borrowedDate || !returnedDate) return 'N/A';
        
        // Handle Firestore timestamps
        let startDate, endDate;
        
        if (borrowedDate && borrowedDate.seconds) {
          startDate = new Date(borrowedDate.seconds * 1000);
        } else {
          startDate = new Date(borrowedDate);
        }
        
        if (returnedDate && returnedDate.seconds) {
          endDate = new Date(returnedDate.seconds * 1000);
        } else {
          endDate = new Date(returnedDate);
        }
        
        const diffTime = Math.abs(endDate - startDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return `${diffDays} days`;
      },
  
      logout() {
        const auth = getAuth();
        auth.signOut().then(() => {
          this.isLoggedIn = false;
          this.userName = '';
          this.userRole = 'user';
          this.isProfileOpen = false;
        }).catch((error) => {
          console.error("Logout error:", error);
        });
      }
    },
    computed: {
      filteredCurrentBorrows() {
        let result = [...this.currentBorrows];
        
        // Apply search filter
        if (this.searchQuery) {
          const query = this.searchQuery.toLowerCase();
          result = result.filter(borrow =>
            borrow.component?.name.toLowerCase().includes(query) ||
            borrow.component?.description?.toLowerCase().includes(query)
          );
        }
        
        // Apply sorting
        if (this.sortBy === 'date-desc') {
          result.sort((a, b) => this.getTimestamp(b.borrowedDate) - this.getTimestamp(a.borrowedDate));
        } else if (this.sortBy === 'date-asc') {
          result.sort((a, b) => this.getTimestamp(a.borrowedDate) - this.getTimestamp(b.borrowedDate));
        } else if (this.sortBy === 'due-date') {
          result.sort((a, b) => this.getTimestamp(a.dueDate) - this.getTimestamp(b.dueDate));
        } else if (this.sortBy === 'name') {
          result.sort((a, b) => a.component?.name.localeCompare(b.component?.name));
        }
        
        return result;
      },
      
      filteredBorrowHistory() {
        let result = [...this.borrowHistory];
        
        // Apply search filter
        if (this.searchQuery) {
          const query = this.searchQuery.toLowerCase();
          result = result.filter(history =>
            history.component?.name.toLowerCase().includes(query) ||
            history.component?.description?.toLowerCase().includes(query)
          );
        }
        
        return result;
      },
      
      dueSoonCount() {
        return this.currentBorrows.filter(borrow => this.isDueSoon(borrow.dueDate)).length;
      },
      
      overdueCount() {
        return this.currentBorrows.filter(borrow => this.isOverdue(borrow.dueDate)).length;
      },
      
      getTimestamp() {
        return (date) => {
          if (!date) return 0;
          if (date.seconds) return date.seconds * 1000;
          if (typeof date === 'string') return new Date(date).getTime();
          return date.getTime();
        };
      }
    }
  };
  </script>