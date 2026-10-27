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
a {
  color: #f2a93b;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
    color: #ff1a1e;
  }
}
v-footer {
  display: flex;
  margin: 0 24px;
  font-size: 14px;
}
.v-footer p{
  margin-left: 0;
}
</style>
