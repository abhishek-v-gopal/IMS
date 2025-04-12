<template>
  <div>
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
          <p class="text-center text-gray-700 mb-4">You do not have permission to access this page. This area is restricted to administrators only.</p>
          <div class="flex justify-center">
            <button @click="goToHomePage" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
              Go Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Not Logged In Modal -->
    <div v-if="showLoginModal" class="fixed inset-0 bg-black/85 flex items-center justify-center z-50">
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
          <p class="text-center text-gray-700 mb-4">You need to be logged in to access this page. Please log in to continue.</p>
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
  </div>
</template>

<script>
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";

export default {
  name: 'AdminCheck',
  props: {
    requiredRole: {
      type: String,
      default: 'admin'
    }
  },
  data() {
    return {
      showUnauthorizedModal: false,
      showLoginModal: false,
      isChecking: true
    }
  },
  created() {
    this.verifyUserAccess();
  },
  methods: {
    async verifyUserAccess() {
      this.isChecking = true;
      const auth = getAuth();
      
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          // User is logged in, check their role
          try {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            
            if (userDoc.exists()) {
              const userData = userDoc.data();
              const userRole = userData.role || 'user';
              
              console.log("User role:", userRole);
              console.log("Required role:", this.requiredRole);
              
              // Check if user has required role
              if (this.requiredRole === 'admin' && userRole !== 'admin') {
                // User doesn't have admin role
                this.showUnauthorizedModal = true;
              } else if (this.requiredRole === 'manager' && 
                         userRole !== 'admin' && userRole !== 'manager') {
                // User doesn't have manager or admin role
                this.showUnauthorizedModal = true;
              }
            } else {
              console.log("No user document found!");
              this.showUnauthorizedModal = true;
            }
          } catch (error) {
            console.error("Error verifying user role:", error);
            this.showUnauthorizedModal = true;
          }
        } else {
          // User is not logged in
          console.log("No user is logged in!");
          this.showLoginModal = true;
        }
        
        this.isChecking = false;
      });
    },
    
    goToHomePage() {
      // Navigate back to homepage
      this.$router.push('/');
    },
    
    showLoginForm() {
      // Hide login modal and navigate to login page
      this.showLoginModal = false;
      this.$router.push({ path: '/', query: { showLogin: 'true' } });
    }
  }
}
</script>
