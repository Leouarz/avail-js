// Populate the sidebar
//
// This is a script, and not included directly in the page, to control the total size of the book.
// The TOC contains an entry for each page, so if each page includes a copy of the TOC,
// the total size of the page becomes O(n**2).
class MDBookSidebarScrollbox extends HTMLElement {
  constructor() {
    super()
  }
  connectedCallback() {
    this.innerHTML =
      '<ol class="chapter"><li class="chapter-item expanded "><a href="account_nonce.html"><strong aria-hidden="true">1.</strong> Account Nonce</a></li><li class="chapter-item expanded "><a href="batch.html"><strong aria-hidden="true">2.</strong> Batch</a></li><li class="chapter-item expanded "><a href="block.html"><strong aria-hidden="true">3.</strong> Block</a></li><li class="chapter-item expanded "><a href="data_submission.html"><strong aria-hidden="true">4.</strong> Data Submission</a></li><li class="chapter-item expanded "><a href="events.html"><strong aria-hidden="true">5.</strong> Events</a></li><li class="chapter-item expanded "><a href="h256.html"><strong aria-hidden="true">6.</strong> H256</a></li><li class="chapter-item expanded "><a href="multisig.html"><strong aria-hidden="true">7.</strong> Multisig</a></li><li class="chapter-item expanded "><a href="rpc.html"><strong aria-hidden="true">8.</strong> RPC</a></li><li class="chapter-item expanded "><a href="setup.html"><strong aria-hidden="true">9.</strong> Setup</a></li><li class="chapter-item expanded "><a href="storage.html"><strong aria-hidden="true">10.</strong> Storage</a></li><li class="chapter-item expanded "><a href="transaction_options.html"><strong aria-hidden="true">11.</strong> Transaction Options</a></li><li class="chapter-item expanded "><a href="transaction_payment.html"><strong aria-hidden="true">12.</strong> Transaction Payment</a></li><li class="chapter-item expanded "><a href="transactions.html"><strong aria-hidden="true">13.</strong> Transactions</a></li><li class="chapter-item expanded "><a href="validator.html"><strong aria-hidden="true">14.</strong> Validator</a></li></ol>'
    // Set the current, active page, and reveal it if it's hidden
    let current_page = document.location.href.toString()
    if (current_page.endsWith("/")) {
      current_page += "index.html"
    }
    var links = Array.prototype.slice.call(this.querySelectorAll("a"))
    var l = links.length
    for (var i = 0; i < l; ++i) {
      var link = links[i]
      var href = link.getAttribute("href")
      if (href && !href.startsWith("#") && !/^(?:[a-z+]+:)?\/\//.test(href)) {
        link.href = path_to_root + href
      }
      // The "index" page is supposed to alias the first chapter in the book.
      if (link.href === current_page || (i === 0 && path_to_root === "" && current_page.endsWith("/index.html"))) {
        link.classList.add("active")
        var parent = link.parentElement
        if (parent && parent.classList.contains("chapter-item")) {
          parent.classList.add("expanded")
        }
        while (parent) {
          if (parent.tagName === "LI" && parent.previousElementSibling) {
            if (parent.previousElementSibling.classList.contains("chapter-item")) {
              parent.previousElementSibling.classList.add("expanded")
            }
          }
          parent = parent.parentElement
        }
      }
    }
    // Track and set sidebar scroll position
    this.addEventListener(
      "click",
      function (e) {
        if (e.target.tagName === "A") {
          sessionStorage.setItem("sidebar-scroll", this.scrollTop)
        }
      },
      { passive: true },
    )
    var sidebarScrollTop = sessionStorage.getItem("sidebar-scroll")
    sessionStorage.removeItem("sidebar-scroll")
    if (sidebarScrollTop) {
      // preserve sidebar scroll position when navigating via links within sidebar
      this.scrollTop = sidebarScrollTop
    } else {
      // scroll sidebar to current active section when navigating via "next/previous chapter" buttons
      var activeSection = document.querySelector("#sidebar .active")
      if (activeSection) {
        activeSection.scrollIntoView({ block: "center" })
      }
    }
    // Toggle buttons
    var sidebarAnchorToggles = document.querySelectorAll("#sidebar a.toggle")
    function toggleSection(ev) {
      ev.currentTarget.parentElement.classList.toggle("expanded")
    }
    Array.from(sidebarAnchorToggles).forEach(function (el) {
      el.addEventListener("click", toggleSection)
    })
  }
}
window.customElements.define("mdbook-sidebar-scrollbox", MDBookSidebarScrollbox)
