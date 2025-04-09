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

    <!-- Page Content -->
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-2xl font-bold text-gray-800 mb-6">Manage Components</h1>

      <!-- Add/Edit Component Form -->
      <form @submit.prevent="isEditing ? updateComponent() : addComponent()" class="bg-white p-6 rounded-lg shadow-md space-y-4">
        <h2 class="text-lg font-medium text-gray-800">{{ isEditing ? 'Edit Component' : 'Add New Component' }}</h2>
        <!-- Form Fields -->
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Component Name</label>
          <input 
            type="text" 
            id="name" 
            v-model="componentForm.name" 
            class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required 
          />
        </div>
        <div>
          <label for="description" class="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea 
            id="description" 
            v-model="componentForm.description" 
            class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            rows="3"
            required
          ></textarea>
        </div>
        <div>
          <label for="category" class="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select 
            id="category" 
            v-model="componentForm.category" 
            class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
          >
            <option value="">Select Category</option>
            <option value="microcontroller">Microcontroller</option>
            <option value="sensor">Sensor</option>
            <option value="display">Display</option>
            <option value="passive">Passive Component</option>
            <option value="tool">Tool</option>
          </select>
        </div>
        <div>
          <label for="stock" class="block text-sm font-medium text-gray-700 mb-1">Stock</label>
          <input 
            type="number" 
            id="stock" 
            v-model="componentForm.stock" 
            class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            min="0"
            required 
          />
        </div>
        <div>
          <label for="available" class="block text-sm font-medium text-gray-700 mb-1">Available</label>
          <input 
            type="number" 
            id="available" 
            v-model="componentForm.available" 
            class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            min="0"
            required 
          />
        </div>
        <div>
          <label for="image" class="block text-sm font-medium text-gray-700 mb-1">Upload Image</label>
          <input 
            type="file" 
            id="image" 
            @change="handleImageUpload" 
            class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            accept="image/*"
          />
        </div>
        <button 
          type="submit" 
          class="w-full bg-emerald-600 text-white py-2 rounded-md hover:bg-emerald-700 transition"
        >
          {{ isEditing ? 'Update Component' : 'Add Component' }}
        </button>
        <button 
          v-if="isEditing" 
          @click="cancelEdit" 
          type="button" 
          class="w-full bg-gray-200 text-gray-700 py-2 rounded-md hover:bg-gray-300 transition mt-2"
        >
          Cancel
        </button>
      </form>

      <!-- Components List -->
      <div class="mt-12 bg-white rounded-lg shadow-sm overflow-hidden">
        <h3 class="text-xl font-bold text-gray-800 px-6 py-4 border-b">Components List</h3>
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Available</th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="component in components" :key="component.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ component.name }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500">{{ component.category }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500">{{ component.stock }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500">{{ component.available }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button @click="editComponent(component)" class="text-blue-600 hover:text-blue-900 mr-4">Edit</button>
                <button @click="deleteComponent(component.id)" class="text-red-600 hover:text-red-900">Delete</button>
                <button @click="borrowComponent(component.id)" class="text-green-600 hover:text-green-900 ml-4">Borrow</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script>
import NavBar from '../components/NavBar.vue';
import Footer from '../components/Footer.vue';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase/config";

export default {
  name: 'AddComponent',
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
      components: [],
      componentForm: {
        name: '',
        description: '',
        category: '',
        stock: 0,
        available: 0, // New variable for borrowable stock
        image: null
      },
      isEditing: false,
      editingComponentId: null,
      selectedImageFile: null // Store the selected image file
    };
  },
  async created() {
    await this.fetchComponents();
  },
  methods: {
    async fetchComponents() {
      const snapshot = await getDocs(collection(db, "components"));
      this.components = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        available: doc.data().available || doc.data().stock || 0, // Initialize available with stock if not defined
      }));
    },
    handleImageUpload(event) {
      this.selectedImageFile = event.target.files[0];
    },
    async uploadImage() {
      if (!this.selectedImageFile) return null;

      const storageRef = ref(storage, `components/${this.selectedImageFile.name}`);
      await uploadBytes(storageRef, this.selectedImageFile);
      return await getDownloadURL(storageRef);
    },
    async addComponent() {
      try {
        // Upload the image and get the URL
        const imageUrl = await this.uploadImage();
        if (imageUrl) {
          this.componentForm.image = imageUrl;
        }

        // Ensure available is not greater than stock
        if (this.componentForm.available > this.componentForm.stock) {
          this.componentForm.available = this.componentForm.stock;
        }

        // Add the component to Firestore
        await addDoc(collection(db, "components"), this.componentForm);

        alert("Component added successfully!");
        this.componentForm = {
          name: '',
          description: '',
          category: '',
          stock: 0,
          available: 0,
          image: null
        };
        this.selectedImageFile = null;
        await this.fetchComponents();
      } catch (error) {
        console.error("Error adding component:", error);
        alert("Failed to add component.");
      }
    },
    editComponent(component) {
      this.isEditing = true;
      this.editingComponentId = component.id;
      this.componentForm = { ...component };
    },
    async updateComponent() {
      const componentDoc = doc(db, "components", this.editingComponentId);
      // Ensure available is not greater than stock
      if (this.componentForm.available > this.componentForm.stock) {
        this.componentForm.available = this.componentForm.stock;
      }
      await updateDoc(componentDoc, this.componentForm);
      this.isEditing = false;
      this.editingComponentId = null;
      this.componentForm = {
        name: '',
        description: '',
        category: '',
        stock: 0,
        available: 0,
        image: null
      };
      await this.fetchComponents();
    },
    async deleteComponent(componentId) {
      await deleteDoc(doc(db, "components", componentId));
      await this.fetchComponents();
    },
    async borrowComponent(componentId) {
      const component = this.components.find(c => c.id === componentId);
      if (component && component.available > 0) {
        const componentDoc = doc(db, "components", componentId);
        await updateDoc(componentDoc, { available: component.available - 1 });
        await this.fetchComponents();
        alert("Component borrowed successfully!");
      } else {
        alert("No available stock to borrow.");
      }
    },
    cancelEdit() {
      this.isEditing = false;
      this.editingComponentId = null;
      this.componentForm = {
        name: '',
        description: '',
        category: '',
        stock: 0,
        available: 0,
        image: null
      };
    },
    logout() {
      this.isLoggedIn = false;
      this.userRole = 'user';
      this.isProfileOpen = false;
    }
  }
};
</script>
