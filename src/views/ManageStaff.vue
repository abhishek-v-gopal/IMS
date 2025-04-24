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
      @update:isMobileMenuOpen="isMobileMenuOpen = $event"
      @update:isProfileOpen="isProfileOpen = $event"
    />

    <!-- Admin Check Component -->
    <AdminCheck requiredRole="admin" />

    <!-- Page Content -->
    <div class="container mx-auto px-4 py-8">
      <!-- Page Header -->
      <div class="mb-6 flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-800">Manage user</h1>
        <button @click="goBack"
          class="flex items-center px-4 py-2 text-sm font-medium text-emerald-600 bg-emerald-50 rounded-md hover:bg-emerald-100 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>
      </div>
      <p class="text-gray-600 mb-6">Add, edit, and manage  members and their roles</p>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-white p-4 rounded-lg shadow-sm">
          <div class="text-sm text-gray-500">Total user</div>
          <div class="text-2xl font-bold text-emerald-600">{{ totalStaff }}</div>
        </div>
        <div class="bg-white p-4 rounded-lg shadow-sm">
          <div class="text-sm text-gray-500">Managers</div>
          <div class="text-2xl font-bold text-amber-600">{{ managerCount }}</div>
        </div>
        <div class="bg-white p-4 rounded-lg shadow-sm">
          <div class="text-sm text-gray-500">Admins</div>
          <div class="text-2xl font-bold text-purple-600">{{ adminCount }}</div>
        </div>
        <div class="bg-white p-4 rounded-lg shadow-sm">
          <div class="text-sm text-gray-500">New This Month</div>
          <div class="text-2xl font-bold text-blue-600">{{ newStaffThisMonth }}</div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-wrap gap-4 mb-6">
        <!-- <button 
          @click="showAddStaffModal = true" 
          class="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add New Staff
        </button> -->
        <button 
          @click="exportStaffList" 
          class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export user List
        </button>
      </div>

      <!-- Tabs -->
      <div class="mb-6">
        <div class="border-b border-gray-200">
          <nav class="-mb-px flex space-x-8">
            <button 
              @click="activeTab = 'all'" 
              :class="`py-4 px-1 ${activeTab === 'all' ? 'border-b-2 border-emerald-500 text-emerald-600' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'} font-medium text-sm`"
            >
              All user
            </button>
            <button 
              @click="activeTab = 'admins'" 
              :class="`py-4 px-1 ${activeTab === 'admins' ? 'border-b-2 border-emerald-500 text-emerald-600' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'} font-medium text-sm`"
            >
              Admins
            </button>
            <button 
              @click="activeTab = 'managers'" 
              :class="`py-4 px-1 ${activeTab === 'managers' ? 'border-b-2 border-emerald-500 text-emerald-600' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'} font-medium text-sm`"
            >
              Managers
            </button>
            <button 
              @click="activeTab = 'users'" 
              :class="`py-4 px-1 ${activeTab === 'users' ? 'border-b-2 border-emerald-500 text-emerald-600' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'} font-medium text-sm`"
            >
              Regular Users
            </button>
            <button 
              @click="activeTab = 'priority'" 
              :class="`py-4 px-1 ${activeTab === 'priority' ? 'border-b-2 border-emerald-500 text-emerald-600' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'} font-medium text-sm`"
            >
              Priority Users
              <span v-if="priorityUsersCount > 0" class="ml-2 bg-amber-100 text-amber-800 py-0.5 px-2 rounded-full text-xs">
                {{ priorityUsersCount }}
              </span>
            </button>
          </nav>
        </div>
      </div>

      <!-- Filters -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div class="relative w-full md:w-96">
          <input 
            type="text" 
            placeholder="Search by name, email, or department..." 
            class="pl-10 pr-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            v-model="searchQuery"
          />
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        
        <div class="flex flex-wrap gap-2">
          <select v-model="departmentFilter" class="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500">
            <option value="">All Departments</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Electronics">Electronics</option>
            <option value="Electrical Engineering">Electrical Engineering</option>
            <option value="Mechanical Engineering">Mechanical Engineering</option>
            <option value="Robotics Club">Robotics Club</option>
          </select>
          
          <select v-model="statusFilter" class="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <svg class="animate-spin h-10 w-10 text-emerald-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="text-gray-600">Loading staff members...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 text-red-800 p-4 rounded-lg text-center my-6">
        <p>{{ error }}</p>
        <button 
          @click="fetchStaffMembers" 
          class="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Try Again
        </button>
      </div>

      <!-- Staff Table -->
      <div v-else class="bg-white rounded-lg shadow-sm overflow-hidden">
        <div v-if="filteredStaff.length === 0" class="text-center py-12">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h3 class="text-lg font-medium text-gray-700 mb-2">No staff members found</h3>
          <p class="text-gray-500">Try adjusting your search or filters</p>
        </div>

        <div v-else>
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff Member</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(staff, index) in filteredStaff" :key="index" class="hover:bg-gray-50">
                <td class="px-6 py-4">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-medium">
                      {{ getInitials(staff.name) }}
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ staff.name }}</div>
                      <div class="text-xs text-gray-500">{{ staff.email }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-900">{{ staff.department }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="`px-2 py-1 text-xs rounded-full ${getRoleBadgeClass(staff.role)}`">
                    {{ staff.role }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="`inline-flex items-center px-2 py-1 text-xs rounded-full ${staff.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`">
                    <span :class="`h-2 w-2 rounded-full mr-1 ${staff.status === 'active' ? 'bg-green-500' : 'bg-gray-500'}`"></span>
                    {{ staff.status === 'active' ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ formatDate(staff.joinedDate) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    @click="viewStaffDetails(staff)" 
                    class="text-emerald-600 hover:text-emerald-900 mr-3"
                  >
                    View
                  </button>
                  <button 
                    @click="editStaff(staff)" 
                    class="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    Edit
                  </button>
                  <button 
                    v-if="userRole === 'admin'"
                    @click="confirmDeleteStaff(staff)" 
                    class="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="filteredStaff.length > 0" class="mt-6 flex items-center justify-between">
        <div class="text-sm text-gray-700">
          Showing <span class="font-medium">1</span> to <span class="font-medium">{{ Math.min(filteredStaff.length, 10) }}</span> of <span class="font-medium">{{ filteredStaff.length }}</span> staff members
        </div>
        <div class="flex space-x-2">
          <button class="px-3 py-1 border rounded-md text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50" disabled>
            Previous
          </button>
          <button class="px-3 py-1 border rounded-md text-sm bg-emerald-50 text-emerald-600 font-medium">
            1
          </button>
          <button v-if="filteredStaff.length > 10" class="px-3 py-1 border rounded-md text-sm text-gray-600 hover:bg-gray-50">
            2
          </button>
          <button v-if="filteredStaff.length > 20" class="px-3 py-1 border rounded-md text-sm text-gray-600 hover:bg-gray-50">
            3
          </button>
          <button v-if="filteredStaff.length > 10" class="px-3 py-1 border rounded-md text-sm text-gray-600 hover:bg-gray-50">
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- Staff Details Modal -->
    <div v-if="showStaffModal" class="fixed inset-0 bg-black/85 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6">
        <div class="flex justify-between items-start mb-4">
          <h3 class="text-xl font-bold text-gray-800">Staff Details</h3>
          <button @click="showStaffModal = false" class="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div v-if="selectedStaff" class="space-y-6">
          <div class="flex items-center">
            <div class="flex-shrink-0 h-20 w-20 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-xl font-medium">
              {{ getInitials(selectedStaff.name) }}
            </div>
            <div class="ml-6">
              <h4 class="text-lg font-medium text-gray-900">{{ selectedStaff.name }}</h4>
              <div class="flex items-center mt-1">
                <span :class="`px-2 py-1 text-xs rounded-full ${getRoleBadgeClass(selectedStaff.role)}`">
                  {{ selectedStaff.role }}
                </span>
                <span class="mx-2 text-gray-500">•</span>
                <span :class="`inline-flex items-center px-2 py-1 text-xs rounded-full ${selectedStaff.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`">
                  <span :class="`h-2 w-2 rounded-full mr-1 ${selectedStaff.status === 'active' ? 'bg-green-500' : 'bg-gray-500'}`"></span>
                  {{ selectedStaff.status === 'active' ? 'Active' : 'Inactive' }}
                </span>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h5 class="text-sm font-medium text-gray-500 mb-2">Contact Information</h5>
              <div class="bg-gray-50 p-4 rounded-md space-y-3">
                <div>
                  <div class="text-xs text-gray-500">Email</div>
                  <div class="text-sm font-medium">{{ selectedStaff.email || 'No email provided' }}</div>
                </div>
                <div>
                  <div class="text-xs text-gray-500">Phone</div>
                  <div class="text-sm">{{ selectedStaff.phone || 'Not provided' }}</div>
                </div>
                <div>
                  <div class="text-xs text-gray-500">Department</div>
                  <div class="text-sm">{{ selectedStaff.department || 'Not assigned' }}</div>
                </div>
              </div>
            </div>

            <div>
              <h5 class="text-sm font-medium text-gray-500 mb-2">Account Information</h5>
              <div class="bg-gray-50 p-4 rounded-md space-y-3">
                <div>
                  <div class="text-xs text-gray-500">Staff ID</div>
                  <div class="text-sm font-medium">{{ selectedStaff.id }}</div>
                </div>
                <div>
                  <div class="text-xs text-gray-500">Role</div>
                  <div class="text-sm font-medium">{{ selectedStaff.role || 'User' }}</div>
                </div>
                <div>
                  <div class="text-xs text-gray-500">Joined Date</div>
                  <div class="text-sm">{{ formatDate(selectedStaff.joinedDate) }}</div>
                </div>
                <div>
                  <div class="text-xs text-gray-500">Last Active</div>
                  <div class="text-sm">{{ formatDate(selectedStaff.lastActive) }}</div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="selectedStaff.role === 'manager' || selectedStaff.role === 'admin'">
            <h5 class="text-sm font-medium text-gray-500 mb-2">Permissions</h5>
            <div class="bg-gray-50 p-4 rounded-md">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div v-for="(permission, index) in selectedStaff.permissions" :key="index" class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-emerald-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span class="text-sm text-gray-700">{{ permission }}</span>
                </div>
              </div>
            </div>
          </div>

          <div v-if="selectedStaff.notes">
            <h5 class="text-sm font-medium text-gray-500 mb-2">Notes</h5>
            <div class="bg-gray-50 p-4 rounded-md">
              <p class="text-sm text-gray-700">{{ selectedStaff.notes }}</p>
            </div>
          </div>

          <div class="flex justify-end space-x-4">
            <button 
              @click="editStaff(selectedStaff); showStaffModal = false" 
              class="px-4 py-2 border border-blue-300 text-blue-700 rounded-md hover:bg-blue-50"
            >
              Edit
            </button>
            <button 
              v-if="selectedStaff.role === 'user' && selectedStaff.priority"
              @click="promoteToManager(selectedStaff); showStaffModal = false" 
              class="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700"
            >
              Promote to Manager
            </button>
            <button 
              v-if="selectedStaff.status === 'active'"
              @click="toggleStaffStatus(selectedStaff); showStaffModal = false" 
              class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Deactivate
            </button>
            <button 
              v-else
              @click="toggleStaffStatus(selectedStaff); showStaffModal = false" 
              class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Activate
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Staff Modal -->
    <div v-if="showAddStaffModal || showEditStaffModal" class="fixed inset-0 bg-black/85 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6">
        <div class="flex justify-between items-start mb-4">
          <h3 class="text-xl font-bold text-gray-800">{{ showEditStaffModal ? 'Edit Staff Member' : 'Add New Staff Member' }}</h3>
          <button @click="cancelStaffForm" class="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="submitStaffForm" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input 
                type="text" 
                id="name" 
                v-model="staffForm.name" 
                class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input 
                type="email" 
                id="email" 
                v-model="staffForm.email" 
                class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
            <div>
              <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input 
                type="tel" 
                id="phone" 
                v-model="staffForm.phone" 
                class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label for="department" class="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <select 
                id="department" 
                v-model="staffForm.department" 
                class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              >
                <option value="">Select Department</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Electronics">Electronics</option>
                <option value="Electrical Engineering">Electrical Engineering</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Robotics Club">Robotics Club</option>
              </select>
            </div>
            <div>
              <label for="role" class="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select 
                id="role" 
                v-model="staffForm.role" 
                class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
                :disabled="userRole !== 'admin' && staffForm.role === 'admin'"
              >
                <option value="user">Regular User</option>
                <option value="manager">Manager</option>
                <option value="admin" v-if="userRole === 'admin'">Admin</option>
              </select>
            </div>
            <div>
              <label for="status" class="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select 
                id="status" 
                v-model="staffForm.status" 
                class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div v-if="staffForm.role === 'manager' || staffForm.role === 'admin'">
            <label class="block text-sm font-medium text-gray-700 mb-1">Permissions</label>
            <div class="bg-gray-50 p-4 rounded-md grid grid-cols-1 md:grid-cols-2 gap-2">
              <div v-for="(permission, index) in availablePermissions" :key="index" class="flex items-center">
                <input 
                  type="checkbox" 
                  :id="`permission-${index}`" 
                  :value="permission" 
                  v-model="staffForm.permissions" 
                  class="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                />
                <label :for="`permission-${index}`" class="ml-2 text-sm text-gray-700">{{ permission }}</label>
              </div>
            </div>
          </div>

          <div>
            <label for="notes" class="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
            <textarea 
              id="notes" 
              v-model="staffForm.notes" 
              rows="3" 
              class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            ></textarea>
          </div>

          <div v-if="staffForm.role === 'user'" class="flex items-center">
            <input 
              type="checkbox" 
              id="priority" 
              v-model="staffForm.priority" 
              class="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
            />
            <label for="priority" class="ml-2 text-sm text-gray-700">Mark as priority user (eligible for manager promotion)</label>
          </div>

          <div class="flex justify-end space-x-4">
            <button 
              type="button"
              @click="cancelStaffForm" 
              class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              class="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
            >
              {{ showEditStaffModal ? 'Update' : 'Add' }} Staff Member
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black/85 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <div class="flex justify-between items-start mb-4">
          <h3 class="text-xl font-bold text-gray-800">Confirm Delete</h3>
          <button @click="showDeleteModal = false" class="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="space-y-4">
          <p class="text-gray-700">Are you sure you want to delete <span class="font-medium">{{ selectedStaff?.name }}</span>? This action cannot be undone.</p>
          
          <div class="flex justify-end space-x-4">
            <button 
              @click="showDeleteModal = false" 
              class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              @click="deleteStaff(); showDeleteModal = false" 
              class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Notification Toast -->
    <div 
      v-if="notification.show" 
      class="fixed bottom-4 right-4 px-4 py-3 rounded-lg shadow-lg z-50"
      :class="notification.type === 'success' ? 'bg-green-600 text-white' : notification.type === 'error' ? 'bg-red-600 text-white' : 'bg-amber-600 text-white'"
    >
      <div class="flex items-center">
        <svg v-if="notification.type === 'success'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        <svg v-if="notification.type === 'error'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
        <svg v-if="notification.type === 'warning'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span>{{ notification.message }}</span>
      </div>
    </div>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script>
import NavBar from '../components/NavBar.vue';
import Footer from '../components/Footer.vue';
import AdminCheck from '../components/AdminCheck.vue';
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase/config";

export default {
  name: 'ManageStaff',
  components: {
    NavBar,
    Footer,
    AdminCheck
  },
  data() {
    return {
      isLoggedIn: true,
      userName: 'Admin User',
      userRole: 'admin',
      userInitials: 'AU',
      isMobileMenuOpen: false,
      isProfileOpen: false,
      showLoginModal: false,
      
      // Tabs and filters
      activeTab: 'all',
      searchQuery: '',
      departmentFilter: '',
      statusFilter: '',
      
      // Staff details modal
      showStaffModal: false,
      selectedStaff: null,
      
      // Add/Edit staff modal
      showAddStaffModal: false,
      showEditStaffModal: false,
      staffForm: {
        id: '',
        name: '',
        email: '',
        phone: '',
        department: '',
        role: 'user',
        status: 'active',
        joinedDate: null,
        lastActive: null,
        permissions: [],
        notes: '',
        priority: false
      },
      
      // Delete confirmation modal
      showDeleteModal: false,
      
      // Notification toast
      notification: {
        show: false,
        type: 'success',
        message: ''
      },
      
      // Available permissions
      availablePermissions: [
        'Manage Components',
        'Approve Requests',
        'Reject Requests',
        'View Reports',
        'Manage Users',
        'Send Notifications',
        'Export Data',
        'Manage Inventory'
      ],
      
      // Staff data
      staffMembers: [],
      
      // Loading and error state
      loading: true,
      error: null
    }
  },
  async created() {
    await this.fetchStaffMembers();
  },
  computed: {
    totalStaff() {
      return this.staffMembers.length;
    },
    managerCount() {
      return this.staffMembers.filter(staff => staff.role === 'manager').length;
    },
    adminCount() {
      return this.staffMembers.filter(staff => staff.role === 'admin').length;
    },
    priorityUsersCount() {
      return this.staffMembers.filter(staff => staff.role === 'user' && staff.priority).length;
    },
    newStaffThisMonth() {
      const today = new Date();
      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      return this.staffMembers.filter(staff => {
        const joinedDate = new Date(staff.joinedDate);
        return joinedDate >= firstDayOfMonth;
      }).length;
    },
    filteredStaff() {
      let result = [...this.staffMembers];
      
      // Filter by tab
      if (this.activeTab === 'admins') {
        result = result.filter(staff => staff.role === 'admin');
      } else if (this.activeTab === 'managers') {
        result = result.filter(staff => staff.role === 'manager');
      } else if (this.activeTab === 'users') {
        result = result.filter(staff => staff.role === 'user' && !staff.priority);
      } else if (this.activeTab === 'priority') {
        result = result.filter(staff => staff.role === 'user' && staff.priority);
      }
      
      // Apply search filter
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        result = result.filter(staff => 
          staff.name.toLowerCase().includes(query) || 
          staff.email.toLowerCase().includes(query) ||
          (staff.department && staff.department.toLowerCase().includes(query))
        );
      }
      
      // Apply department filter
      if (this.departmentFilter) {
        result = result.filter(staff => staff.department === this.departmentFilter);
      }
      
      // Apply status filter
      if (this.statusFilter) {
        result = result.filter(staff => staff.status === this.statusFilter);
      }
      
      return result;
    }
  },
  methods: {
    async fetchStaffMembers() {
      try {
        this.loading = true;
        this.error = null;
        
        console.log("Fetching staff members...");
        const staffSnapshot = await getDocs(collection(db, "users"));
        console.log(`Retrieved ${staffSnapshot.docs.length} staff members`);
        
        // Map the data and handle missing fields
        this.staffMembers = staffSnapshot.docs.map((doc) => {
          const data = doc.data();
          return { 
            id: doc.id,
            name: data.name || 'Unnamed User',
            email: data.email || 'No email provided',
            phone: data.phone || '',
            department: data.department || 'Unassigned',
            role: data.role || 'user',
            status: data.status || 'active',
            joinedDate: data.joinedDate || new Date(),
            lastActive: data.lastActive || new Date(),
            permissions: data.permissions || [],
            notes: data.notes || '',
            priority: data.priority || false
          };
        });
        
        console.log("Staff members successfully loaded:", this.staffMembers);
      } catch (error) {
        console.error("Error fetching staff members:", error);
        this.error = "Failed to load staff members. Please try again.";
        this.staffMembers = [];
      } finally {
        this.loading = false;
      }
    },
    goBack() {
    // Go back to previous page in browser history
    this.$router.go(-1);
  },
    formatDate(date) {
      if (!date) return '';
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(date).toLocaleDateString('en-US', options);
    },
    
    getInitials(name) {
      if (!name) return '';
      return name
        .split(' ')
        .map(part => part.charAt(0))
        .join('')
        .toUpperCase()
        .substring(0, 2);
    },
    
    getRoleBadgeClass(role) {
      switch (role) {
        case 'admin':
          return 'bg-purple-100 text-purple-800';
        case 'manager':
          return 'bg-amber-100 text-amber-800';
        case 'user':
          return 'bg-blue-100 text-blue-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    },
    
    viewStaffDetails(staff) {
      this.selectedStaff = staff;
      this.showStaffModal = true;
    },
    
    editStaff(staff) {
      this.staffForm = JSON.parse(JSON.stringify(staff)); // Deep copy
      this.showEditStaffModal = true;
    },
    
    confirmDeleteStaff(staff) {
      this.selectedStaff = staff;
      this.showDeleteModal = true;
    },
    
    async deleteStaff() {
      try {
        if (!this.selectedStaff || !this.selectedStaff.id) {
          this.showNotification('error', 'No staff member selected');
          return;
        }
        
        // Delete from Firebase
        await deleteDoc(doc(db, "users", this.selectedStaff.id));
        
        // Remove from local state
        const index = this.staffMembers.findIndex(s => s.id === this.selectedStaff.id);
        if (index !== -1) {
          this.staffMembers.splice(index, 1);
        }
        
        this.showNotification('success', `${this.selectedStaff.name} has been deleted`);
      } catch (error) {
        console.error("Error deleting staff:", error);
        this.showNotification('error', `Failed to delete: ${error.message}`);
      }
    },
    
    async toggleStaffStatus(staff) {
      try {
        const index = this.staffMembers.findIndex(s => s.id === staff.id);
        if (index !== -1) {
          const newStatus = staff.status === 'active' ? 'inactive' : 'active';
          
          // Update in Firebase
          const staffDoc = doc(db, "users", staff.id);
          await updateDoc(staffDoc, { status: newStatus });
          
          // Update local state
          this.staffMembers[index].status = newStatus;
          this.showNotification('success', `${staff.name} is now ${newStatus}`);
        }
      } catch (error) {
        console.error("Error updating staff status:", error);
        this.showNotification('error', `Failed to update status: ${error.message}`);
      }
    },
    
    async promoteToManager(staff) {
      try {
        const index = this.staffMembers.findIndex(s => s.id === staff.id);
        if (index !== -1) {
          const defaultPermissions = [
            'Manage Components',
            'Approve Requests',
            'Reject Requests',
            'View Reports'
          ];
          
          // Update in Firebase
          const staffDoc = doc(db, "users", staff.id);
          await updateDoc(staffDoc, { 
            role: 'manager',
            priority: false,
            permissions: defaultPermissions
          });
          
          // Update local state
          this.staffMembers[index].role = 'manager';
          this.staffMembers[index].priority = false;
          this.staffMembers[index].permissions = defaultPermissions;
          
          this.showNotification('success', `${staff.name} has been promoted to Manager`);
        }
      } catch (error) {
        console.error("Error promoting staff:", error);
        this.showNotification('error', `Failed to promote: ${error.message}`);
      }
    },
    
    cancelStaffForm() {
      this.showAddStaffModal = false;
      this.showEditStaffModal = false;
      this.resetStaffForm();
    },
    
    resetStaffForm() {
      this.staffForm = {
        id: '',
        name: '',
        email: '',
        phone: '',
        department: '',
        role: 'user',
        status: 'active',
        joinedDate: null,
        lastActive: null,
        permissions: [],
        notes: '',
        priority: false
      };
    },
    
    async submitStaffForm() {
      try {
        if (this.showEditStaffModal) {
          const staffDoc = doc(db, "users", this.staffForm.id);
          await updateDoc(staffDoc, this.staffForm);
          this.showNotification("success", "Staff member updated successfully!");
        } else {
          // For new staff, make sure to set required fields
          const newStaff = {
            ...this.staffForm,
            joinedDate: new Date(),
            lastActive: new Date()
          };
          await addDoc(collection(db, "users"), newStaff);
          this.showNotification("success", "Staff member added successfully!");
        }
        
        // Refresh the staff list after adding/updating
        await this.fetchStaffMembers();
        this.cancelStaffForm();
      } catch (error) {
        console.error("Error saving staff member:", error);
        this.showNotification("error", "Failed to save staff member: " + error.message);
      }
    },
    
    exportStaffList() {
      // In a real app, you would generate a CSV or Excel file
      this.showNotification('success', 'Staff list exported successfully');
    },
    
    showNotification(type, message) {
      this.notification = {
        show: true,
        type,
        message
      };
      
      // Hide notification after 3 seconds
      setTimeout(() => {
        this.notification.show = false;
      }, 3000);
    },
    
    logout() {
      this.isLoggedIn = false;
      this.userRole = 'user';
      this.isProfileOpen = false;
    }
  }
}
</script>

<style scoped>
.transition {
  transition: all 0.3s ease;
}
</style>