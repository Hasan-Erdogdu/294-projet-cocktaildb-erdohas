<template>
  <v-footer class="footer">
    <a
      class="footer-link"
      href="https://www.addictionsuisse.ch/"
      rel="noopener noreferrer"
      target="_blank"
    >
      Si vous avez des problèmes d'alcool, cliquez sur ce lien
    </a>
    <p class="footer-note">
      Il faut faire gaffe, mes amis. C'est bon, mais il ne faut pas finir dans un article « Ivre, … ».
    </p>
  </v-footer>
</template>

<script setup>
</script>

<style scoped>
.footer {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 8px 32px;
  padding: 20px 32px;
  font-size: 0.875rem;
  line-height: 1.4;
  border-top: 2px solid #f2a93b;
}

/* Le lien vers Addiction Suisse */
.footer-link {
  color: #f2a93b;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.2s;
}

.footer-link:hover {
  color: #ffd27a;
  text-decoration: underline;
}

/* La note, plus discrète que le lien */
.footer-note {
  margin: 0;
  opacity: 0.7;
  text-align: right;
}

/* Téléphone : les deux textes l'un sous l'autre, centrés */
@media (max-width: 700px) {
  .footer {
    flex-direction: column;
    padding: 20px 16px;
    text-align: center;
  }

  .footer-note {
    text-align: center;
  }
}
</style>
