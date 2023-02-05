<!-- ReadMe template forked from: https://github.com/othneildrew/Best-README-Template -->

<a name="readme-top"></a>
# Power Outage Push Notifications 🔌:mauritius:
<!-- ABOUT THE PROJECT -->

### About The Project

A Node.js application that allows the user to look up when the next planned power outage of their locality will occur.<br>
The application pulls data from [CEB](https://ceb.mu/customer-corner/power-outage-information) and uses this [dataset](https://github.com/MrSunshyne/mauritius-dataset-electricity).
###### Note: Current state of the app only serves to query the dataset, push notification features are under development 🚧 <br>

#### Built with;

[![Node][Node.js]][Node-url]
[![npm][npm]][npm-url]
[![electricity][electricity]][electricity-url]


<!-- GETTING STARTED -->
# Getting Started

## Prerequisites

Download node on your machine from [here](https://nodejs.org/en/download/) and install the required npm packages;

  ```
  npm i express node-fetch nodemon
  ```
  
  Clone the repo;

  ```sh
  git clone https://github.com/wazeerc/popn
  ```

Start the node server within the project directory;

  ```sh
  npm run start
  ``` 
  <br>

<!-- USAGE EXAMPLES -->
<!-- ## Usage


#### Features: -->



<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right"><a href="#readme-top">back to top</a></p>


<!-- MARKDOWN LINKS & IMAGES -->
[Node.js]: https://img.shields.io/badge/node.js-000000?style=for-the-badge&logo=nodedotjs&logoColor=white
[Node-url]: https://nodejs.org/
[npm]: https://img.shields.io/badge/npm-000000?style=for-the-badge&logo=npm&logoColor=white
[npm-url]: https://www.npmjs.com/
[electricity]: https://img.shields.io/badge/%E2%9A%A1-000000?style=for-the-badge&logo=power&logoColor=white
[electricity-url]: https://
