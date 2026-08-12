---
layout: archive
title: "Publications"
permalink: /publications/
author_profile: false
---

<p class="page-intro">Selected papers, preprints, and conference presentations. See also <a href="https://scholar.google.com/citations?user=n0WbtPYAAAAJ&hl=en">Google Scholar</a>.</p>

{% include base_path %}

<h2>Preprints</h2>
{% for post in site.publications reversed %}
  {% if post.type == 'preprint' %}
    {% include archive-single.html %}
  {% endif %}
{% endfor %}

<h2>Journal Articles</h2>
{% for post in site.publications reversed %}
  {% if post.type == 'journal' %}
    {% include archive-single.html %}
  {% endif %}
{% endfor %}

<h2>Conference Articles</h2>
{% for post in site.publications reversed %}
  {% if post.type == 'conference' %}
    {% include archive-single.html %}
  {% endif %}
{% endfor %}
