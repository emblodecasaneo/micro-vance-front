<template>
  <div class="fixed top-4 right-4 z-50 flex flex-col space-y-2">
    <transition-group name="toast">
      <div 
        v-for="toast in toasts" 
        :key="toast.id"
        :class="getToastClass(toast.type)"
        class="px-4 py-3 rounded-md shadow-md flex items-start max-w-md"
      >
        <div class="flex-1">
          <p class="text-sm font-medium">{{ toast.message }}</p>
        </div>
        <button 
          @click="removeToast(toast.id)" 
          class="ml-4 text-gray-400 hover:text-gray-600 focus:outline-none"
        >
          <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </transition-group>
  </div>
</template>

<script>
import { useToast } from '@/composables/toast';

export default {
  name: 'Toast',
  setup() {
    const { toasts, removeToast } = useToast();
    
    const getToastClass = (type) => {
      switch (type) {
        case 'success':
          return 'bg-green-100 text-green-800';
        case 'error':
          return 'bg-red-100 text-red-800';
        case 'warning':
          return 'bg-yellow-100 text-yellow-800';
        default:
          return 'bg-blue-100 text-blue-800';
      }
    };
    
    return {
      toasts,
      removeToast,
      getToastClass
    };
  }
};
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(30px);
}
.toast-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}
</style> 