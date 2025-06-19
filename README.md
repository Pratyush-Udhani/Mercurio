# Mercurio
Mercurio is an AI-powered pipeline that takes a product URL (currently from Amazon), scrapes key product information and media assets, generates a custom promotional script using OpenAI, and turns it into a short (15–30 sec) video.

Mercurio utilizes Pywright library to fetch product data from amazon site. 

The homepage consists of a single input box for entering the amazon link: 

![image](https://github.com/user-attachments/assets/8ebbfce8-7229-46b7-be3a-8d59d4c7375f)

After entering the image, a workflow with unique uuid will be created and the data 
- Product Name
- Product Description 
- Product Images, main and alt 
will be auto-filled.

With just one press of a button, you can generate four different advertisement prompts using OpenAI's API.  

![image](https://github.com/user-attachments/assets/b9f5140d-2aaf-4cb0-88f3-d416dd77e2e4)

And finally after selecting the prompt you preper, using Remotion, two videos will be generated with the text overlay. 



https://github.com/user-attachments/assets/7076ae1d-e8c1-4b12-bd52-8e16fdf1e534


https://github.com/user-attachments/assets/90777422-17ab-44a1-9470-d8f8075d9eee





