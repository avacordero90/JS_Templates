
  var CLIENT_ID = '42zjexze6mfpf7x';

  // Parses the url and gets the access token if it is in the urls hash
  function getAccessTokenFromUrl() {
   return utils.parseQueryString(window.location.hash).access_token;
  }

  // If the user was just redirected from authenticating, the urls hash will
  // contain the access token.
  function isAuthenticated() {
    return !!getAccessTokenFromUrl();
  }

  // Render a list of items to #files
  function renderItems(items) {
    var filesContainer = document.getElementById('files');
    items.forEach(function(item) {
      var li = document.createElement('li');
      li.innerHTML = item.name;
      filesContainer.appendChild(li);
    });
  }

  // This example keeps both the authenticate and non-authenticated setions
  // in the DOM and uses this function to show/hide the correct section.
  function showPageSection(elementId) {
    document.getElementById(elementId).style.display = 'block';
  }

  if (isAuthenticated()) {
    showPageSection('authed-section');

    // Create an instance of Dropbox with the access token and use it to
    // fetch and render the files in the users root directory.
    var dbx = new Dropbox({ accessToken: getAccessTokenFromUrl() });
    dbx.filesListFolder({path: ''})
      .then(function(response) {
        renderItems(response.entries);
      })
      .catch(function(error) {
        console.error(error);
      });
  } else {
    showPageSection('pre-auth-section');

    // Set the login anchors href using dbx.getAuthenticationUrl()
    var dbx = new Dropbox({ clientId: CLIENT_ID });
    var authUrl = dbx.getAuthenticationUrl('http://localhost:8080/auth');
    document.getElementById('authlink').href = authUrl;
  }









<nav class="navbar navbar-default">
<div class="container"> 
  <!-- Brand and toggle get grouped for better mobile display -->
  <div class="navbar-header">
    <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#myDefaultNavbar1" aria-expanded="false"> <span class="sr-only">Toggle navigation</span> <span class="icon-bar"></span> <span class="icon-bar"></span> <span class="icon-bar"></span> </button>
    <a class="navbar-brand" href="#">Brand</a> </div>
  <!-- Collect the nav links, forms, and other content for toggling -->
  <div class="collapse navbar-collapse" id="myDefaultNavbar1">
    <ul class="nav navbar-nav">
      <li class="active"><a href="#">Link <span class="sr-only">(current)</span></a></li>
      <li><a href="#">Link</a></li>
      <li class="dropdown"> <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false" aria-haspopup="true">Dropdown <span class="caret"></span></a>
        <ul class="dropdown-menu">
          <li><a href="#">Action</a></li>
          <li><a href="#">Another action</a></li>
          <li><a href="#">Something else here</a></li>
          <li role="separator" class="divider"></li>
          <li><a href="#">Separated link</a></li>
          <li role="separator" class="divider"></li>
          <li><a href="#">One more separated link</a></li>
        </ul>
      </li>
    </ul>
    <form class="navbar-form navbar-right" role="search">
      <div class="form-group">
        <input type="text" class="form-control" placeholder="Search">
      </div>
      <button type="submit" class="btn btn-default">Submit</button>
    </form>
</div>
  <!-- /.navbar-collapse --> 
</div>
<!-- /.container-fluid --> 
</nav>