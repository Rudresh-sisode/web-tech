from bs4 import BeautifulSoup

html = """
<html>
  <body>
    <div class="example" data-set="first">Hello, world,!</div>
    <div class="example" id="second">Goodbye, world!</div>
  </body>
</html>
"""

soup = BeautifulSoup(html, 'html.parser')

# Find the div with id "first"
div_first = soup.find('div', {'data-set': 'first'})

# Get the inner HTML text of the div with id "first"
inner_html = div_first.decode_contents()

print(inner_html) # Output: "Hello, world!"