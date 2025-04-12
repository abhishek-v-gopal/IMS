<template>
  <div v-if="show" class="fixed inset-0 bg-black/85 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl font-bold text-gray-800">Login</h3>
        <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700">
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
        <button @click="login" class="w-full bg-emerald-600 text-white py-2 rounded-md hover:bg-emerald-700 transition">Login</button>
      </div>
      <div class="mt-4 text-center text-sm text-gray-600">
        Don't have an account? 
        <button 
          @click="$emit('show-registration')" 
          class="text-emerald-600 hover:text-emerald-500"
        >
          Register
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

export default {
  name: 'LoginModal',
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close', 'login-success', 'show-registration'],
  data() {
    return {
      loginForm: {
        email: '',
        password: ''
      }
    };
  },
  methods: {
    async login() {
      try {
        // Validate inputs
        if (!this.loginForm.email || !this.loginForm.password) {
          alert("Please enter both email and password.");
          return;
        }
        
        const auth = getAuth();
        
        // Attempt to sign in with Firebase Auth
        const userCredential = await signInWithEmailAndPassword(
          auth, 
          this.loginForm.email, 
          this.loginForm.password
        );
        
        // Check if auth was successful and user was returned
        const user = userCredential.user;
        if (!user) {
          throw new Error("Authentication succeeded but no user was returned");
        }
        
        console.log("Authentication successful. User ID:", user.uid);
        
        // Emit login success event
        this.$emit('login-success', user);
        
        // Close the modal
        this.$emit('close');
        
        // Alert success
        alert("Login successful!");
      } catch (error) {
        console.error("Error logging in:", error);
        alert(`Login failed: ${error.message || "Unknown error"}`);
      }
    }
  }
};
</script>
