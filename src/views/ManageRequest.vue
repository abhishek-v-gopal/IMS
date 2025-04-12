<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <NavBar :isLoggedIn="isLoggedIn" :userName="userName" :userRole="userRole" :userInitials="userInitials"
      :isMobileMenuOpen="isMobileMenuOpen" :isProfileOpen="isProfileOpen" @show-login-modal="showLoginModal = true"
      @logout="logout" @update:isMobileMenuOpen="isMobileMenuOpen = $event"
      @update:isProfileOpen="isProfileOpen = $event" />

    <!-- Page Content -->
    <div class="container mx-auto px-4 py-8">

      <!-- Page Header -->
      <div class="mb-6 flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-800">Manage Requests</h1>
        <button @click="goBack"
          class="flex items-center px-4 py-2 text-sm font-medium text-emerald-600 bg-emerald-50 rounded-md hover:bg-emerald-100 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>
      </div>
      <p class="text-gray-600 mb-6">Review and manage component borrowing and return requests</p>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-white p-4 rounded-lg shadow-sm">
          <div class="text-sm text-gray-500">Pending Requests</div>
          <div class="text-2xl font-bold text-amber-600">{{ pendingRequests.length }}</div>
        </div>
        <div class="bg-white p-4 rounded-lg shadow-sm">
          <div class="text-sm text-gray-500">Approved Today</div>
          <div class="text-2xl font-bold text-green-600">{{ approvedToday }}</div>
        </div>
        <div class="bg-white p-4 rounded-lg shadow-sm">
          <div class="text-sm text-gray-500">Rejected Today</div>
          <div class="text-2xl font-bold text-red-600">{{ rejectedToday }}</div>
        </div>
        <div class="bg-white p-4 rounded-lg shadow-sm">
          <div class="text-sm text-gray-500">Overdue Returns</div>
          <div class="text-2xl font-bold text-red-600">{{ overdueReturns }}</div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="mb-6">
        <div class="border-b border-gray-200">
          <nav class="-mb-px flex space-x-8">
            <button @click="activeTab = 'pending'"
              :class="`py-4 px-1 ${activeTab === 'pending' ? 'border-b-2 border-emerald-500 text-emerald-600' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'} font-medium text-sm`">
              Pending Requests
              <span v-if="pendingRequests.length > 0"
                class="ml-2 bg-amber-100 text-amber-800 py-0.5 px-2 rounded-full text-xs">
                {{ pendingRequests.length }}
              </span>
            </button>
            <button @click="activeTab = 'approved'"
              :class="`py-4 px-1 ${activeTab === 'approved' ? 'border-b-2 border-emerald-500 text-emerald-600' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'} font-medium text-sm`">
              Approved
            </button>
            <button @click="activeTab = 'rejected'"
              :class="`py-4 px-1 ${activeTab === 'rejected' ? 'border-b-2 border-emerald-500 text-emerald-600' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'} font-medium text-sm`">
              Rejected
            </button>
            <button @click="activeTab = 'overdue'"
              :class="`py-4 px-1 ${activeTab === 'overdue' ? 'border-b-2 border-emerald-500 text-emerald-600' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'} font-medium text-sm`">
              Overdue
              <span v-if="overdueReturns > 0" class="ml-2 bg-red-100 text-red-800 py-0.5 px-2 rounded-full text-xs">
                {{ overdueReturns }}
              </span>
            </button>
            <button @click="activeTab = 'history'"
              :class="`py-4 px-1 ${activeTab === 'history' ? 'border-b-2 border-emerald-500 text-emerald-600' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'} font-medium text-sm`">
              History
            </button>
          </nav>
        </div>
      </div>

      <!-- Filters -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div class="relative w-full md:w-96">
          <input type="text" placeholder="Search by component or user..."
            class="pl-10 pr-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            v-model="searchQuery" />
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 absolute left-3 top-2.5" fill="none"
            viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div class="flex flex-wrap gap-2">
          <select v-model="requestTypeFilter"
            class="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500">
            <option value="">All Request Types</option>
            <option value="borrow">Borrow Requests</option>
            <option value="return">Return Requests</option>
          </select>

          <select v-model="dateFilter"
            class="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500">
            <option value="">All Dates</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </div>

      <!-- Pending Requests Tab -->
      <div v-if="activeTab === 'pending'" class="bg-white rounded-lg shadow-sm overflow-hidden">
        <div v-if="filteredRequests.length === 0" class="text-center py-12">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none"
            viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 class="text-lg font-medium text-gray-700 mb-2">No pending requests</h3>
          <p class="text-gray-500">All requests have been processed. Great job!</p>
        </div>

        <div v-else>
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Request</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status</th>
                <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(request, index) in filteredRequests" :key="index" class="hover:bg-gray-50">
                <td class="px-6 py-4">
                  <div class="flex items-center">
                    <div
                      class="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-md flex items-center justify-center overflow-hidden">
                      <img :src="request.component.image" :alt="request.component.name"
                        class="max-h-full max-w-full object-contain" />
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ request.component.name }}</div>
                      <div class="text-xs text-gray-500">
                        <span :class="`font-medium ${request.type === 'borrow' ? 'text-blue-600' : 'text-green-600'}`">
                          {{ request.type === 'borrow' ? 'Borrow' : 'Return' }}
                        </span>
                        <span v-if="request.type === 'borrow'"> • Quantity: {{ request.quantity }}</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm font-medium text-gray-900">{{ request.user.name }}</div>
                  <div class="text-xs text-gray-500">{{ request.user.email }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ formatDate(request.requestDate) }}</div>
                  <div class="text-xs text-gray-500">{{ formatTime(request.requestDate) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-800">
                    Pending
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button @click="viewRequestDetails(request)" class="text-emerald-600 hover:text-emerald-900 mr-3">
                    View
                  </button>
                  <button @click="approveRequest(request)" class="text-green-600 hover:text-green-900 mr-3">
                    Approve
                  </button>
                  <button @click="rejectRequest(request)" class="text-red-600 hover:text-red-900">
                    Reject
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Approved Requests Tab -->
      <div v-if="activeTab === 'approved'" class="bg-white rounded-lg shadow-sm overflow-hidden">
        <div v-if="approvedRequests.length === 0" class="text-center py-12">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none"
            viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 class="text-lg font-medium text-gray-700 mb-2">No approved requests</h3>
          <p class="text-gray-500">There are no approved requests to display.</p>
        </div>

        <div v-else>
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Request</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status</th>
                <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(request, index) in approvedRequests" :key="index" class="hover:bg-gray-50">
                <td class="px-6 py-4">
                  <div class="flex items-center">
                    <div
                      class="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-md flex items-center justify-center overflow-hidden">
                      <img :src="request.component.image" :alt="request.component.name"
                        class="max-h-full max-w-full object-contain" />
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ request.component.name }}</div>
                      <div class="text-xs text-gray-500">
                        <span :class="`font-medium ${request.type === 'borrow' ? 'text-blue-600' : 'text-green-600'}`">
                          {{ request.type === 'borrow' ? 'Borrow' : 'Return' }}
                        </span>
                        <span v-if="request.type === 'borrow'"> • Quantity: {{ request.quantity }}</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm font-medium text-gray-900">{{ request.user.name }}</div>
                  <div class="text-xs text-gray-500">{{ request.user.email }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ formatDate(request.approvalDate) }}</div>
                  <div class="text-xs text-gray-500">{{ formatTime(request.approvalDate) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                    Approved
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button @click="viewRequestDetails(request)" class="text-emerald-600 hover:text-emerald-900 mr-3">
                    View
                  </button>
                  <button @click="sendReminder(request)" v-if="request.type === 'borrow' && !request.returned"
                    class="text-amber-600 hover:text-amber-900">
                    Send Reminder
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Rejected Requests Tab -->
      <div v-if="activeTab === 'rejected'" class="bg-white rounded-lg shadow-sm overflow-hidden">
        <div v-if="rejectedRequests.length === 0" class="text-center py-12">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none"
            viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 class="text-lg font-medium text-gray-700 mb-2">No rejected requests</h3>
          <p class="text-gray-500">There are no rejected requests to display.</p>
        </div>

        <div v-else>
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Request</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status</th>
                <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(request, index) in rejectedRequests" :key="index" class="hover:bg-gray-50">
                <td class="px-6 py-4">
                  <div class="flex items-center">
                    <div
                      class="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-md flex items-center justify-center overflow-hidden">
                      <img :src="request.component.image" :alt="request.component.name"
                        class="max-h-full max-w-full object-contain" />
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ request.component.name }}</div>
                      <div class="text-xs text-gray-500">
                        <span :class="`font-medium ${request.type === 'borrow' ? 'text-blue-600' : 'text-green-600'}`">
                          {{ request.type === 'borrow' ? 'Borrow' : 'Return' }}
                        </span>
                        <span v-if="request.type === 'borrow'"> • Quantity: {{ request.quantity }}</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm font-medium text-gray-900">{{ request.user.name }}</div>
                  <div class="text-xs text-gray-500">{{ request.user.email }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ formatDate(request.rejectionDate) }}</div>
                  <div class="text-xs text-gray-500">{{ formatTime(request.rejectionDate) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                    Rejected
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button @click="viewRequestDetails(request)" class="text-emerald-600 hover:text-emerald-900 mr-3">
                    View
                  </button>
                  <button @click="reconsiderRequest(request)" class="text-amber-600 hover:text-amber-900">
                    Reconsider
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Overdue Requests Tab -->
      <div v-if="activeTab === 'overdue'" class="bg-white rounded-lg shadow-sm overflow-hidden">
        <div v-if="overdueRequestsList.length === 0" class="text-center py-12">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none"
            viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 class="text-lg font-medium text-gray-700 mb-2">No overdue returns</h3>
          <p class="text-gray-500">All borrowed components are within their due dates.</p>
        </div>

        <div v-else>
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Component</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Overdue By</th>
                <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(request, index) in overdueRequestsList" :key="index" class="hover:bg-gray-50">
                <td class="px-6 py-4">
                  <div class="flex items-center">
                    <div
                      class="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-md flex items-center justify-center overflow-hidden">
                      <img :src="request.component.image" :alt="request.component.name"
                        class="max-h-full max-w-full object-contain" />
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ request.component.name }}</div>
                      <div class="text-xs text-gray-500">Quantity: {{ request.quantity }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm font-medium text-gray-900">{{ request.user.name }}</div>
                  <div class="text-xs text-gray-500">{{ request.user.email }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ formatDate(request.dueDate) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                    {{ getDaysOverdue(request.dueDate) }} days
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button @click="viewRequestDetails(request)" class="text-emerald-600 hover:text-emerald-900 mr-3">
                    View
                  </button>
                  <button @click="sendReminder(request)" class="text-amber-600 hover:text-amber-900 mr-3">
                    Send Reminder
                  </button>
                  <button @click="markAsReturned(request)" class="text-green-600 hover:text-green-900">
                    Mark Returned
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- History Tab -->
      <div v-if="activeTab === 'history'" class="bg-white rounded-lg shadow-sm overflow-hidden">
        <div v-if="allRequests.length === 0" class="text-center py-12">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none"
            viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 class="text-lg font-medium text-gray-700 mb-2">No request history</h3>
          <p class="text-gray-500">There is no request history to display.</p>
        </div>

        <div v-else>
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Request</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status</th>
                <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(request, index) in allRequests" :key="index" class="hover:bg-gray-50">
                <td class="px-6 py-4">
                  <div class="flex items-center">
                    <div
                      class="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-md flex items-center justify-center overflow-hidden">
                      <img :src="request.component.image" :alt="request.component.name"
                        class="max-h-full max-w-full object-contain" />
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ request.component.name }}</div>
                      <div class="text-xs text-gray-500">
                        <span :class="`font-medium ${request.type === 'borrow' ? 'text-blue-600' : 'text-green-600'}`">
                          {{ request.type === 'borrow' ? 'Borrow' : 'Return' }}
                        </span>
                        <span v-if="request.type === 'borrow'"> • Quantity: {{ request.quantity }}</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm font-medium text-gray-900">{{ request.user.name }}</div>
                  <div class="text-xs text-gray-500">{{ request.user.email }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ formatDate(request.requestDate) }}</div>
                  <div class="text-xs text-gray-500">{{ formatTime(request.requestDate) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="`px-2 py-1 text-xs rounded-full ${getStatusClass(request.status)}`">
                    {{ request.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button @click="viewRequestDetails(request)" class="text-emerald-600 hover:text-emerald-900">
                    View
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="activeTab === 'history' && allRequests.length > 0" class="mt-6 flex items-center justify-between">
        <div class="text-sm text-gray-700">
          Showing <span class="font-medium">1</span> to <span class="font-medium">{{ Math.min(allRequests.length, 10)
            }}</span> of <span class="font-medium">{{ allRequests.length }}</span> requests
        </div>
        <div class="flex space-x-2">
          <button class="px-3 py-1 border rounded-md text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50"
            disabled>
            Previous
          </button>
          <button class="px-3 py-1 border rounded-md text-sm bg-emerald-50 text-emerald-600 font-medium">
            1
          </button>
          <button v-if="allRequests.length > 10"
            class="px-3 py-1 border rounded-md text-sm text-gray-600 hover:bg-gray-50">
            2
          </button>
          <button v-if="allRequests.length > 20"
            class="px-3 py-1 border rounded-md text-sm text-gray-600 hover:bg-gray-50">
            3
          </button>
          <button v-if="allRequests.length > 10"
            class="px-3 py-1 border rounded-md text-sm text-gray-600 hover:bg-gray-50">
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- Request Details Modal -->
    <div v-if="showRequestModal" class="fixed inset-0 bg-black/85 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6">
        <div class="flex justify-between items-start mb-4">
          <h3 class="text-xl font-bold text-gray-800">Request Details</h3>
          <button @click="showRequestModal = false" class="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div v-if="selectedRequest" class="space-y-6">
          <div class="flex items-center">
            <div
              class="flex-shrink-0 h-16 w-16 bg-gray-200 rounded-md flex items-center justify-center overflow-hidden">
              <img :src="selectedRequest.component.image" :alt="selectedRequest.component.name"
                class="max-h-full max-w-full object-contain" />
            </div>
            <div class="ml-4">
              <h4 class="text-lg font-medium text-gray-900">{{ selectedRequest.component.name }}</h4>
              <div class="flex items-center mt-1">
                <span :class="`px-2 py-1 text-xs rounded-full ${getStatusClass(selectedRequest.status)}`">
                  {{ selectedRequest.status }}
                </span>
                <span class="mx-2 text-gray-500">•</span>
                <span
                  :class="`text-sm font-medium ${selectedRequest.type === 'borrow' ? 'text-blue-600' : 'text-green-600'}`">
                  {{ selectedRequest.type === 'borrow' ? 'Borrow Request' : 'Return Request' }}
                </span>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h5 class="text-sm font-medium text-gray-500 mb-2">Request Information</h5>
              <div class="bg-gray-50 p-4 rounded-md space-y-3">
                <div>
                  <div class="text-xs text-gray-500">Request ID</div>
                  <div class="text-sm font-medium">{{ selectedRequest.id }}</div>
                </div>
                <div>
                  <div class="text-xs text-gray-500">Request Date</div>
                  <div class="text-sm">{{ formatDate(selectedRequest.requestDate) }} at {{
                    formatTime(selectedRequest.requestDate) }}</div>
                </div>
                <div v-if="selectedRequest.type === 'borrow'">
                  <div class="text-xs text-gray-500">Quantity</div>
                  <div class="text-sm">{{ selectedRequest.quantity }}</div>
                </div>
                <div v-if="selectedRequest.type === 'borrow' && selectedRequest.status === 'Approved'">
                  <div class="text-xs text-gray-500">Due Date</div>
                  <div class="text-sm">{{ formatDate(selectedRequest.dueDate) }}</div>
                </div>
                <div v-if="selectedRequest.status === 'Approved'">
                  <div class="text-xs text-gray-500">Approved On</div>
                  <div class="text-sm">{{ formatDate(selectedRequest.approvalDate) }} at {{
                    formatTime(selectedRequest.approvalDate) }}</div>
                </div>
                <div v-if="selectedRequest.status === 'Rejected'">
                  <div class="text-xs text-gray-500">Rejected On</div>
                  <div class="text-sm">{{ formatDate(selectedRequest.rejectionDate) }} at {{
                    formatTime(selectedRequest.rejectionDate) }}</div>
                </div>
              </div>
            </div>

            <div>
              <h5 class="text-sm font-medium text-gray-500 mb-2">User Information</h5>
              <div class="bg-gray-50 p-4 rounded-md space-y-3">
                <div>
                  <div class="text-xs text-gray-500">Name</div>
                  <div class="text-sm font-medium">{{ selectedRequest.user.name }}</div>
                </div>
                <div>
                  <div class="text-xs text-gray-500">Email</div>
                  <div class="text-sm">{{ selectedRequest.user.email }}</div>
                </div>
                <div>
                  <div class="text-xs text-gray-500">Role</div>
                  <div class="text-sm">{{ selectedRequest.user.role }}</div>
                </div>
                <div>
                  <div class="text-xs text-gray-500">Department</div>
                  <div class="text-sm">{{ selectedRequest.user.department }}</div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="selectedRequest.notes">
            <h5 class="text-sm font-medium text-gray-500 mb-2">Notes</h5>
            <div class="bg-gray-50 p-4 rounded-md">
              <p class="text-sm text-gray-700">{{ selectedRequest.notes }}</p>
            </div>
          </div>

          <div v-if="selectedRequest.status === 'Pending'" class="flex justify-end space-x-4">
            <button @click="rejectRequest(selectedRequest); showRequestModal = false"
              class="px-4 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50">
              Reject
            </button>
            <button @click="approveRequest(selectedRequest); showRequestModal = false"
              class="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700">
              Approve
            </button>
          </div>

          <div
            v-if="selectedRequest.status === 'Approved' && selectedRequest.type === 'borrow' && !selectedRequest.returned"
            class="flex justify-end space-x-4">
            <button @click="sendReminder(selectedRequest); showRequestModal = false"
              class="px-4 py-2 border border-amber-300 text-amber-700 rounded-md hover:bg-amber-50">
              Send Reminder
            </button>
            <button @click="markAsReturned(selectedRequest); showRequestModal = false"
              class="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700">
              Mark as Returned
            </button>
          </div>

          <div v-if="selectedRequest.status === 'Rejected'" class="flex justify-end space-x-4">
            <button @click="reconsiderRequest(selectedRequest); showRequestModal = false"
              class="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700">
              Reconsider
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Notification Toast -->
    <div v-if="notification.show" class="fixed bottom-4 right-4 px-4 py-3 rounded-lg shadow-lg z-50"
      :class="notification.type === 'success' ? 'bg-green-600 text-white' : notification.type === 'error' ? 'bg-red-600 text-white' : 'bg-amber-600 text-white'">
      <div class="flex items-center">
        <svg v-if="notification.type === 'success'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none"
          viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        <svg v-if="notification.type === 'error'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none"
          viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
        <svg v-if="notification.type === 'warning'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none"
          viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
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
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase/config";

export default {
  name: 'ManageRequests',
  components: {
    NavBar,
    Footer
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
      activeTab: 'pending',
      searchQuery: '',
      requestTypeFilter: '',
      dateFilter: '',

      // Request details modal
      showRequestModal: false,
      selectedRequest: null,

      // Notification toast
      notification: {
        show: false,
        type: 'success',
        message: ''
      },

      // Sample data
      requests: [], // Array to store all borrow requests

      // Initialize stats values
      approvedToday: 0,
      rejectedToday: 0,
      overdueReturns: 0,
    }
  },
  async created() {
    try {
      console.log("Fetching borrow requests...");
      const requestSnapshot = await getDocs(collection(db, "borrowRequests")); // Fetch borrow requests
      console.log("Borrow requests fetched:", requestSnapshot);

      const fetchedRequests = requestSnapshot.docs.map((doc) => {
        const data = doc.data();
        // Create component and user objects for UI display based on the actual data structure
        return {
          id: doc.id,
          ...data,
          component: {
            name: data.componentName || 'Unknown Component',
            image: 'https://via.placeholder.com/100' // Default image since componentImage doesn't exist
          },
          user: {
            name: data.userName || 'Unknown User',
            email: data.userId || 'No email provided' // Use userId as email since userEmail doesn't exist
          }
        };
      });
      console.log("Fetched requests array:", fetchedRequests);

      // Ensure the fetched data is reactive
      this.requests.splice(0, this.requests.length, ...fetchedRequests);
      console.log("Reactive requests:", this.requests);

      // Calculate stats right after loading data
      this.calculateStats();
    } catch (error) {
      console.error("Error fetching borrow requests:", error);
    }
  },
  computed: {
    pendingRequests() {
      // Make sure we're strictly comparing with the string 'Pending'
      const pending = this.requests.filter(request => request.status === 'Pending');
      console.log("Filtered Pending Requests:", pending); // Debug log pending requests
      return pending;
    },
    approvedRequests() {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const approved = this.requests.filter(request => request.status === 'Approved');

      // Count today's approved requests for the stats card
      this.approvedToday = approved.filter(request => {
        if (!request.approvalDate) return false;

        let approvalDate;
        if (request.approvalDate.seconds) {
          approvalDate = new Date(request.approvalDate.seconds * 1000);
        } else {
          approvalDate = new Date(request.approvalDate);
        }

        approvalDate.setHours(0, 0, 0, 0);
        return approvalDate.getTime() === today.getTime();
      }).length;

      console.log("Approved Requests:", approved);
      return approved;
    },
    rejectedRequests() {
      const rejected = this.requests.filter(request => request.status === 'Rejected');
      console.log("Rejected Requests:", rejected); // Debugging
      return rejected;
    },
    overdueRequestsList() {
      const today = new Date();
      const overdue = this.requests.filter(request => {
        if (request.status !== 'Approved' || !request.dueDate) return false;

        // Convert Firestore timestamp to Date
        let dueDate;
        if (request.dueDate.seconds) {
          dueDate = new Date(request.dueDate.seconds * 1000);
        } else {
          dueDate = new Date(request.dueDate);
        }

        return dueDate < today;
      });

      // Set overdueReturns for the stats card
      this.overdueReturns = overdue.length;

      console.log("Overdue Requests:", overdue);
      return overdue;
    },
    allRequests() {
      const sorted = [...this.requests].sort((a, b) => new Date(b.requestDate) - new Date(a.requestDate));
      console.log("All Requests:", sorted); // Debugging
      return sorted;
    },
    filteredRequests() {
      // For the pending tab, we need to make sure only pending requests are shown
      if (this.activeTab === 'pending') {
        let result = this.requests.filter(request => request.status === 'Pending');

        // Then apply additional filters from search, type, and date
        if (this.searchQuery) {
          const query = this.searchQuery.toLowerCase();
          result = result.filter(request =>
            request.componentName?.toLowerCase().includes(query) ||
            request.userName?.toLowerCase().includes(query)
          );
        }

        // Apply request type filter
        if (this.requestTypeFilter) {
          result = result.filter(request => request.type === this.requestTypeFilter);
        }

        // Apply date filter
        if (this.dateFilter) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          if (this.dateFilter === 'today') {
            result = result.filter(request => {
              if (!request.requestDate) return false;

              // Handle Firestore Timestamp objects
              let requestDate;
              if (request.requestDate.seconds) { // Firestore Timestamp
                requestDate = new Date(request.requestDate.seconds * 1000);
              } else { // Regular Date
                requestDate = new Date(request.requestDate);
              }

              requestDate.setHours(0, 0, 0, 0);
              return requestDate.getTime() === today.getTime();
            });
          } else if (this.dateFilter === 'week') {
            const weekStart = new Date(today);
            weekStart.setDate(today.getDate() - today.getDay());

            result = result.filter(request => {
              if (!request.requestDate) return false;

              // Handle Firestore Timestamp objects
              let requestDate;
              if (request.requestDate.seconds) { // Firestore Timestamp
                requestDate = new Date(request.requestDate.seconds * 1000);
              } else { // Regular Date
                requestDate = new Date(request.requestDate);
              }

              return requestDate >= weekStart;
            });
          } else if (this.dateFilter === 'month') {
            const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

            result = result.filter(request => {
              if (!request.requestDate) return false;

              // Handle Firestore Timestamp objects
              let requestDate;
              if (request.requestDate.seconds) { // Firestore Timestamp
                requestDate = new Date(request.requestDate.seconds * 1000);
              } else { // Regular Date
                requestDate = new Date(request.requestDate);
              }

              return requestDate >= monthStart;
            });
          }
        }

        console.log("Final filtered pending requests:", result);
        return result;
      } else {
        let result = this.requests;

        // Apply search filter
        if (this.searchQuery) {
          const query = this.searchQuery.toLowerCase();
          result = result.filter(request =>
            request.componentName?.toLowerCase().includes(query) ||
            request.userName?.toLowerCase().includes(query)
          );
        }

        // Apply request type filter
        if (this.requestTypeFilter) {
          result = result.filter(request => request.type === this.requestTypeFilter);
        }

        // Apply date filter
        if (this.dateFilter) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          if (this.dateFilter === 'today') {
            result = result.filter(request => {
              if (!request.requestDate) return false;

              // Handle Firestore Timestamp objects
              let requestDate;
              if (request.requestDate.seconds) { // Firestore Timestamp
                requestDate = new Date(request.requestDate.seconds * 1000);
              } else { // Regular Date
                requestDate = new Date(request.requestDate);
              }

              requestDate.setHours(0, 0, 0, 0);
              return requestDate.getTime() === today.getTime();
            });
          } else if (this.dateFilter === 'week') {
            const weekStart = new Date(today);
            weekStart.setDate(today.getDate() - today.getDay());

            result = result.filter(request => {
              if (!request.requestDate) return false;

              // Handle Firestore Timestamp objects
              let requestDate;
              if (request.requestDate.seconds) { // Firestore Timestamp
                requestDate = new Date(request.requestDate.seconds * 1000);
              } else { // Regular Date
                requestDate = new Date(request.requestDate);
              }

              return requestDate >= weekStart;
            });
          } else if (this.dateFilter === 'month') {
            const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

            result = result.filter(request => {
              if (!request.requestDate) return false;

              // Handle Firestore Timestamp objects
              let requestDate;
              if (request.requestDate.seconds) { // Firestore Timestamp
                requestDate = new Date(request.requestDate.seconds * 1000);
              } else { // Regular Date
                requestDate = new Date(request.requestDate);
              }

              return requestDate >= monthStart;
            });
          }
        }

        console.log("Filtered Requests:", result); // Debugging
        return result;
      }
    }
  },
  methods: {
    formatDate(date) {
      if (!date) return '';

      // Handle Firestore Timestamp objects
      let dateObj;
      if (date.seconds) { // Firestore Timestamp
        dateObj = new Date(date.seconds * 1000);
      } else { // Regular Date
        dateObj = new Date(date);
      }

      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return dateObj.toLocaleDateString('en-US', options);
    },
    goBack() {
      // Go back to previous page in browser history
      this.$router.go(-1);
    },
    formatTime(date) {
      if (!date) return '';

      // Handle Firestore Timestamp objects
      let dateObj;
      if (date.seconds) { // Firestore Timestamp
        dateObj = new Date(date.seconds * 1000);
      } else { // Regular Date
        dateObj = new Date(date);
      }

      const options = { hour: '2-digit', minute: '2-digit' };
      return dateObj.toLocaleTimeString('en-US', options);
    },

    getDaysOverdue(dueDate) {
      if (!dueDate) return 0;

      const today = new Date();
      let due;

      // Convert Firestore timestamp to Date
      if (dueDate.seconds) {
        due = new Date(dueDate.seconds * 1000);
      } else {
        due = new Date(dueDate);
      }

      const diffTime = today - due;
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    },

    getStatusClass(status) {
      switch (status) {
        case 'Pending':
          return 'bg-amber-100 text-amber-800';
        case 'Approved':
          return 'bg-green-100 text-green-800';
        case 'Rejected':
          return 'bg-red-100 text-red-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    },

    viewRequestDetails(request) {
      // If component object doesn't have image or has incorrect structure, fix it
      if (!request.component || !request.component.image) {
        request.component = {
          name: request.componentName || 'Unknown Component',
          image: request.componentImage || 'https://via.placeholder.com/100'
        };
      }

      // If user object is missing or incorrect, fix it
      if (!request.user || !request.user.name) {
        request.user = {
          name: request.userName || 'Unknown User',
          email: request.userEmail || request.userId || 'No email provided',
          role: 'user',
          department: 'N/A'
        };
      }

      this.selectedRequest = request;
      this.showRequestModal = true;
    },

    async approveRequest(request) {
      if (request.status !== 'Pending') {
        this.showNotification('error', 'Only pending requests can be approved.');
        return;
      }

      try {
        const requestDoc = doc(db, "borrowRequests", request.id);
        await updateDoc(requestDoc, {
          status: "Approved",
          approvalDate: new Date(),
          dueDate: new Date(new Date().setDate(new Date().getDate() + 7)) // Set due date to 7 days from now
        });
        request.status = "Approved"; // Update local state
        this.showNotification("success", "Request approved successfully!");
      } catch (error) {
        console.error("Error approving request:", error);
        this.showNotification("error", "Failed to approve request.");
      }
    },

    async rejectRequest(request) {
      if (request.status !== 'Pending') {
        this.showNotification('error', 'Only pending requests can be rejected.');
        return;
      }

      try {
        const requestDoc = doc(db, "borrowRequests", request.id);
        await updateDoc(requestDoc, {
          status: "Rejected",
          rejectionDate: new Date()
        });
        request.status = "Rejected"; // Update local state
        this.showNotification("error", "Request rejected successfully!");
      } catch (error) {
        console.error("Error rejecting request:", error);
        this.showNotification("error", "Failed to reject request.");
      }
    },

    async markAsReturned(request) {
      if (request.status !== 'Approved') {
        this.showNotification('error', 'Only approved requests can be marked as returned.');
        return;
      }

      if (request.returned) {
        this.showNotification('error', 'This request is already marked as returned.');
        return;
      }

      try {
        const requestDoc = doc(db, "borrowRequests", request.id);
        await updateDoc(requestDoc, {
          returned: true,
          returnDate: new Date()
        });
        request.returned = true; // Update local state
        this.showNotification("success", "Component marked as returned successfully!");
      } catch (error) {
        console.error("Error marking as returned:", error);
        this.showNotification("error", "Failed to mark as returned.");
      }
    },

    reconsiderRequest(request) {
      if (request.status !== 'Rejected') {
        this.showNotification('error', 'Only rejected requests can be reconsidered.');
        return;
      }

      request.status = 'Pending';
      request.rejectionDate = null;
      this.showNotification('warning', 'Request moved back to pending.');
    },

    sendReminder(request) {
      if (request.status !== 'Approved' || request.returned) {
        this.showNotification('error', 'Reminders can only be sent for approved and unreturned requests.');
        return;
      }

      // In a real app, you would make an API call to send a reminder
      this.showNotification('success', `Reminder sent to ${request.user.name}`);
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
    },

    logRequests() {
      console.log("Current Requests State:", this.requests);
    },

    calculateStats() {
      // Calculate Approved Today
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      this.approvedToday = this.requests.filter(request => {
        if (!request.approvalDate || request.status !== 'Approved') return false;

        let approvalDate;
        if (request.approvalDate.seconds) {
          approvalDate = new Date(request.approvalDate.seconds * 1000);
        } else {
          approvalDate = new Date(request.approvalDate);
        }

        approvalDate.setHours(0, 0, 0, 0);
        return approvalDate.getTime() === today.getTime();
      }).length;

      // Calculate Rejected Today
      this.rejectedToday = this.requests.filter(request => {
        if (!request.rejectionDate || request.status !== 'Rejected') return false;

        let rejectionDate;
        if (request.rejectionDate.seconds) {
          rejectionDate = new Date(request.rejectionDate.seconds * 1000);
        } else {
          rejectionDate = new Date(request.rejectionDate);
        }

        rejectionDate.setHours(0, 0, 0, 0);
        return rejectionDate.getTime() === today.getTime();
      }).length;

      // Calculate Overdue Returns
      this.overdueReturns = this.requests.filter(request => {
        if (request.status !== 'Approved' || !request.dueDate || request.returned) return false;

        let dueDate;
        if (request.dueDate.seconds) {
          dueDate = new Date(request.dueDate.seconds * 1000);
        } else {
          dueDate = new Date(request.dueDate);
        }

        return dueDate < new Date();
      }).length;

      console.log("Stats calculated:", {
        pendingCount: this.pendingRequests.length,
        approvedToday: this.approvedToday,
        rejectedToday: this.rejectedToday,
        overdueReturns: this.overdueReturns
      });
    }
  }
}
</script>

<style scoped>
.transition {
  transition: all 0.3s ease;
}
</style>