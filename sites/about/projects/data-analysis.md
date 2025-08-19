---
layout: default
title: Data Analysis
permalink: /about/projects/data-analysis/
---

<div id="page-about-projects" class="w3-main">
  <section id="data-analysis" class="w3-container">
    <h2><b>Data Analysis</b> (<a href="https://github.com/leeyanleryan/Data-Analysis" target="_blank">Link</a>)</h2>
    <h5 class="h5-text-gap">
      This project is a compilation of multiple data analysis projects, most of which incorporate the use of various Machine Learning algorithms for predictions.
    </h5>
    <h3><u>Breast Cancer Analysis (<a href="https://github.com/leeyanleryan/Data-Analysis/tree/main/Breast%20Cancer%20Analysis%20(IT1244)" target="_blank">Link</a>)</u></h3>
    <div class="media-display">
      {% include image-loader.html file="dataanalysis-bca-heatmap1.png" file_width="683" file_height="574" css_width="33%" %}
      {% include image-loader.html file="dataanalysis-bca-heatmap2.png" file_width="647" file_height="551" css_width="33%" %}
      {% include image-loader.html file="dataanalysis-bca-heatmap3.png" file_width="670" file_height="573" css_width="33%" %}
    </div>
    <h5 class="h5-text-gap">
      The project aimed to classify breast cancer samples (benign vs. malignant) by analyzing imaging attributes from a fine needle aspirate (FNA). It also explored mislabelled
      data detection to improve data quality.
    </h5>
    <h5 class="h5-text-gap">
      This project was completed by me and three others for IT1244, a machine learning course at NUS. We chose this topic because we believed that discovering an effective 
      solution could significantly benefit the medical field.
    </h5>
    <h5 class="h5-img-gap">
      Dataset:
      <ul class="ul-margin-top-0">
        <li>569 samples labeled 'B' (benign) or 'M' (malignant)</li>
        <li>30 features capturing mean, standard error and "worst" measurements of cell nuclei (i.e., radius, texture, concavity)</li>
        <li>Correlation analysis identified the most influential features (i.e., radius, concavity, concave points)</li>
      </ul>
    </h5>
    <div class="media-display">
      {% include image-loader.html file="dataanalysis-bca-fe1.png" file_width="655" file_height="547" css_width="50%" %}
      {% include image-loader.html file="dataanalysis-bca-fe2.png" file_width="671" file_height="547" css_width="50%" %}
    </div>
    <h5 class="h5-text-gap">
      The problem was split into two tasks. For the first task, we are told that some labels have been mislabelled, and we are required to detect them. We utilised several
      methods, combining them together to perform a multi-faceted approach in the detection process.
    </h5>
    <h5 class="h5-text-gap">
      The attribute 'radius' refers to the radius of the tumour. The bigger the tumour, the more harmful it is, falling into the malignant category. We performed feature
      engineering on this attribute, taking the squared difference and cubed difference of radius_worst and radius_mean. This allowed the data to split almost perfectly
      into two categories, one benign (blue), the other malignant (red). The blues above the curve and the reds below the curve are considered mislabelled data.
    </h5>
    <h5 class="h5-img-gap">
      Task 1 - Mislabelled Data Detection Methods:
      <ul class="ul-margin-top-0">
        <li>Feature Engineering: Computed differences (worst - mean) and examined squared/cubed values to distinguish benign vs. malignant curves</li>
        <li>K-Means Clustering: Ran multiple initializations to find consistent outliers</li>
        <li>Logistic Regression: Tested whether flagged points consistently mismatched the known labels</li>
      </ul>
    </h5>
    <div class="media-display">
      {% include image-loader.html file="dataanalysis-bca-rocauc1.png" file_width="567" file_height="455" css_width="25%" %}
      {% include image-loader.html file="dataanalysis-bca-rocauc2.png" file_width="567" file_height="455" css_width="25%" %}
      {% include image-loader.html file="dataanalysis-bca-rocauc3.png" file_width="567" file_height="455" css_width="25%" %}
      {% include image-loader.html file="dataanalysis-bca-rocauc4.png" file_width="567" file_height="455" css_width="25%" %}
    </div>
    <h5 class="h5-text-gap">
      For the second task, we are required to classify the type of breast cancer ('B' vs 'M') given the diagnosis. To do this, we employed the use of several Machine
      Learning algorithms, using 10-fold cross-validation and multiple metrics like Accuracy, F1 Score and ROC-AUC to assess the model.
    </h5>
    <h5 class="h5-text-gap">
      For the pictures, from left to right, the ROC-AUC curves are obtained from the Machine Learning approaches below respectively. If the image is too small, you
      can zoom in or right click, then open image in new tab.
    </h5>
    <h5 class="h5-img-gap">
      Task 2 - Breast Cancer Classification Approaches:
      <ul class="ul-margin-top-0">
        <li>Logistic Regression (LR)</li>
        <li>k-Nearest Neighbours (kNN)</li>
        <li>Random Forest (RF)</li>
        <li>Support Vector Machines (SVM)</li>
      </ul>
    </h5>
    <div class="media-display">
      {% include image-loader.html file="dataanalysis-bca-keyfindings1.png" file_width="977" file_height="374" css_width="80%" %}
    </div>
    <h5 class="h5-text-gap">
      Key Results:
      <ul class="ul-margin-top-0">
        <li>SVM performed best across all metrics, suggesting it handles high-dimensional, non-linear data effectively</li>
        <li>LR came in a close second, indicating the decision boundary might not be overly complex</li>
        <li>kNN struggled in higher dimensions without additional feature reduction</li>
        <li>RF showed signs of overfitting and noise sensitivity with certain irrelevant features</li>
      </ul>
    </h5>
    <h3><u>Enhancing Guest Experience (<a href="https://github.com/leeyanleryan/Data-Analysis/tree/main/Enhancing%20Guest%20Experience%20(DSA3101)" target="_blank">Link</a>)</u></h3>
    <div style="display:flex; justify-content:center; gap:10px; align-items:center;">
      {% include image-loader.html file="dataanalysis-ege-waittime1.png" file_width="976" file_height="455" css_width="100%" %}
    </div>
    <h5 class="h5-text-gap">
      The project aimed to enhance overall guest experience at Universal Studios Singapore (USS). This project was completed by me and 7 others for DSA3101, a course in NUS on
      practical Data Science.
    </h5>
    <h5 class="h5-img-gap">
      My objective is to optimally allocate staff to different attractions at an amusement park (e.g., Universal Studios Singapore) in order to reduce wait times and improve guest 
      satisfaction. Two models: Linear Optimization and Greedy Heuristic, are compared.
    </h5>
    <div class="media-display">
      {% include image-loader.html file="dataanalysis-ege-models1.png" file_width="1266" file_height="1240" css_width="80%" %}
    </div>
    <h5 class="h5-text-gap">
      Model 1 - Linear Optimization:
      <ul class="ul-margin-top-0">
        <li>Objective: Minimize the total deviation from a target staff allocation</li>
        <li>Constraints:
          <ol>
            <li>Total staff assigned must not exceed the available staff</li>
            <li>Each attraction has a minimum staff requirement</li>
            <li>Staff allocation must be close to forecasted wait times</li>
          </ol>
        </li>
        <li>Insights:
          <ol>
            <li>Tends to produce allocations proportional to ride wait times</li>
            <li>Occassionally fails to find a feasible solution if constraints are too tight</li>
          </ol>
        </li>
      </ul>
    </h5>
    <h5 class="h5-img-gap">
      Model 2 - Greedy Heuristic:
      <ul class="ul-margin-top-0">
        <li>Objective: Reduce overall wait times by continually allocating staff to the ride with the highest current wait time</li>
        <li>Wait-Time Formula: Each additional staff reduces wait time by a certain factor (i.e., 0.95)</li>
        <li>Insights:
          <ol>
            <li>Always yields a feasible solution</li>
            <li>May produce a more uniform allocation than the linear model</li>
            <li>Assumes wait time decreases consistently with each staff addition, which might not always be true</li>
          </ol>
        </li>
      </ul>
    </h5>
    <div class="media-display">
      {% include image-loader.html file="dataanalysis-ege-comparison1.png" file_width="562" file_height="455" css_width="60%" %}
    </div>
    <h5 class="h5-img-gap">
      Comparing Both Models:
      <ol class="ol-margin-top-0">
        <li>Allocations:
          <ul>
            <li>Linear Optimization often mirrors the distribution of forecasted wait times</li>
            <li>Greedy Heuristic focuses on whichever ride currently has the longest wait, potentially distributing staff less proportionally</li>
          </ul>
        </li>
        <li>Decision Rule:
          <ul>
            <li>By default, pick the model that allocates more staff to the highest-wait attraction</li>
            <li>If both allocate equally, default to Linear Optimization (since it tracks wait-time distribution more closely)</li>
          </ul>
        </li>
        <li>Trade-Offs:
          <ul>
            <li>Greedy is guaranteed feasible but might over-allocate staff to a single ride if it assumes continuous wait-time reductions</li>
            <li>Linear Optimization can fail in certain scenarios but often reflects a more directly proportional distribution</li>
          </ul>
        </li>
      </ol>
    </h5>
    <div class="media-display">
      {% include image-loader.html file="dataanalysis-ege-usage1.png" file_width="684" file_height="626" css_width="60%" %}
    </div>
    <h5 class="h5-text-gap">
      Usage and Implementation:
      <ol class="ol-margin-top-0">
        <li>
          User Inputs:
          <ul>
            <li>Forecasted wait times</li>
            <li>Total available staff</li>
            <li>Minimum staff per attraction</li>
            <li>(Optional) A reduction factor for the Greedy model</li>
          </ul>
        </li>
        <li>
          Outputs:
          <ul>
            <li>Recommended staff allocation from each model, plus a final “chosen” allocation based on the decision rule</li>
            <li>Bar plots visualizing how each model distributes staff</li>
          </ul>
        </li>
        <li>Observations:
          <ul>
            <li>Both models run quickly (milliseconds)</li>
            <li>Stakeholders can override the recommended choice if they prefer a more uniform distribution or have other practical considerations</li>
          </ul>
        </li>
      </ol>
    </h5>
    <h5>
      By comparing Linear Optimization and a Greedy Heuristic, this system provides two distinct allocations for staff assignment—one aligning more proportionally 
      with forecasted wait times, and another always feasible but potentially less proportional. Users can choose the final allocation that best fits their operational 
      goals and constraints.
    </h5>
  </section>
</div>