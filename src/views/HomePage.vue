<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div class="ion-padding">
        <ion-text color="dark">
          <h1 class="ion-text-center">
            Interview Assistant
          </h1>
          <p class="ion-text-center subtitle">
            Choose your interview mode
          </p>
        </ion-text>
        
        <ion-grid class="ion-no-padding">
          <ion-row class="ion-align-items-stretch">
            <ion-col
              size="12"
              size-md="6"
              class="ion-padding"
            >
              <ion-card
                button
                class="full-height"
                @click="selectOption('practice')"
              >
                <ion-card-header>
                  <div class="icon-wrapper practice">
                    <ion-icon
                      :icon="personAdd"
                      size="large"
                    />
                  </div>
                  <ion-card-title>Practice Interview</ion-card-title>
                </ion-card-header>
                <ion-card-content>
                  Hone your skills with AI-powered mock interviews tailored to your experience level and desired role.
                </ion-card-content>
              </ion-card>
            </ion-col>
            
            <ion-col
              size="12"
              size-md="6"
              class="ion-padding"
            >
              <ion-card
                button
                class="full-height"
                @click="selectOption('real')"
              >
                <ion-card-header>
                  <div class="icon-wrapper real">
                    <ion-icon
                      :icon="people"
                      size="large"
                    />
                  </div>
                  <ion-card-title>Real Interview Assistance</ion-card-title>
                </ion-card-header>
                <ion-card-content>
                  Get real-time support and guidance during your actual interview to boost your confidence and performance.
                </ion-card-content>
              </ion-card>
            </ion-col>
          </ion-row>
        </ion-grid>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { 
  IonPage, IonContent, IonText, IonGrid, IonRow, IonCol, 
  IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonIcon
} from '@ionic/vue';
import { personAdd, people } from 'ionicons/icons';
import { useRouter } from 'vue-router';

const router = useRouter();

const selectOption = (option: 'practice' | 'real') => {
  console.log(`Selected option: ${option}`);
  if (option === 'practice') {
    router.push('/practice-interview');
  } else {
    router.push('/real-interview');
  }
};
</script>

<style scoped>
ion-content {
  --background: linear-gradient(180deg, #f4f5f8 0%, #e0e0e0 100%);
}

h1 {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.subtitle {
  font-size: 1.2rem;
  color: var(--ion-color-medium);
  margin-bottom: 2rem;
}

ion-card {
  margin: 0;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
}

ion-card:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.full-height {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.icon-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  margin: 1rem auto;
}

.icon-wrapper.practice {
  background-color: var(--ion-color-primary-tint);
  color: var(--ion-color-primary);
}

.icon-wrapper.real {
  background-color: var(--ion-color-success-tint);
  color: var(--ion-color-success);
}

ion-card-title {
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
}

ion-card-content {
  font-size: 1rem;
  text-align: center;
  color: var(--ion-color-medium);
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>