<template>
  <div class="pa-8">
    <h1>Cookie Policy</h1>
    <p>
      <strong>Effective date:</strong> July 7rd, 2020
    </p>

    <h1>What is a cookie?</h1>
    <p>A cookie is a small text file with an identifier sent by us to your computer or mobile device, and stored in your browser. “Session-based” cookies last only while your browser is open and are then deleted. “Persistent” cookies last until you or your browser deletes them, or they expire. Cookies do not typically contain any personally identifiable information, but may be linked to personal information we store about you. E.g. if you are logged in with a registered user, the cookie will help us remember that you are logged in when you return to the site. To find out more about cookies, visit <a href="http://www.allaboutcookies.org/">this site.</a></p>

    <h2>What is local storage?</h2>
    <p>Local storage is a component of the Web storage application programming interface. It is a method by which Web pages can store information inside your Web browser. Similar to cookies, this stored information exists even when you close a browser tab, surf away from the current website or close the main browser. But unlike cookies this data is not carried to the remote Web server unless sent explicitly by the web page. Local storage is often used to remember choices a user has made inside a Web application or to cache information to improve performance. Elements stored in browser Local storage is covered by this policy to the extent that the information stored in these elements is communicated back to the server.</p>

    <h2>How we use cookies and local storage?</h2>

    <ul>
      <li>
        <h3>Authentication</h3>
        We use local storage to identify you when you visit our website and to authenticate calls our web application makes to the backend servers on your behalf. If you're signed in to Roomler, this helps us show you the right information and personalize your experience. (Local storage element used for this purpose is: “token”)
      </li>
      <li>
        <h3>Analysis</h3>
        We use cookies to help us analyze the usage patterns and performance of our website and services. We use Google Analytics for this purpose.
      </li>
      <li>
        <h3>Payment</h3>
        We use cookies to enable easy payment processing and to detect fraud through our payment processor Stripe Payments Europe, Ltd. (“Stripe”).
      </li>
    </ul>
    <h1>Relevant Links</h1>
    <ul>
      <li>
        <nuxt-link :to="localePath({ name: 'tos-terms' })">
          Terms of Service
        </nuxt-link>
      </li>
      <li>
        <nuxt-link :to="localePath({ name: 'tos-privacy' })">
          Privacy Policy
        </nuxt-link>
      </li>
    </ul>
    <h1>&nbsp;</h1>
  </div>
</template>
