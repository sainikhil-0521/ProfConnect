const mongoose= require("mongoose");
const { app } = require("../db");
const supertest = require("supertest");
const request= supertest(app);
const user = require("../routes/user");
require("dotenv").config()

app.use("/users",user);




describe('basic setup of database ', () => {
  /* Connecting to the database before each test. */
      beforeAll(async () => {
        await mongoose.connect("mongodb+srv://sainikhil:DBIN137411@cluster0.yvtkjnb.mongodb.net/ProfConnect");
      });

      describe("checking if user valid given a username and password", () => {
       
        it("valid email and pwd ", async () => {
            const e="rama@gmail.com";
            const p="rama123"
            const response = await request.post("/users/valid").send({
              email: e,
              password: p
            })
            //console.log(response)
           
          expect(response.body.user).toEqual("valid pwd");
          expect(response.statusCode).toEqual(200)
          })
          it("if Admin logged in", async () => {
            const e="adminprofconnect@gmail.com";
            const p="admin@123"
            const response = await request.post("/users/valid").send({
              email: e,
              password: p
            })
            //console.log(response)
           
            expect(response.body.user).toEqual("admin");
          expect(response.statusCode).toEqual(200)
          })

        it("Invalid password ", async () => {
            const response = await request.post("/users/valid").send({
              email: "rama@gmail.com",
              password: "password"
            })
          expect(response.body.user).toEqual("Invalid pwd");
            expect(response.token).toBeUndefined();;
           
          })
       
         

      })
      describe('signup of a user', () => {
        it('password and confirm password not same', async() => {
            const response = await request.post("/users/signup").send({
                email: "rama2@gmail.com",
                username:"rama2",
                password: "password",
                cpassword:"word"
              })
            expect(response.body.user).toEqual("Invalid pwd");
            expect(response.statusCode).toEqual(200)
        });
        it('if  userdetails are valid', async() => {
            const response = await request.post("/users/signup").send({
                email: "rama2@gmail.com",
                username:"ramakrishna2",
                password: "rama1234",
                cpassword:"rama1234"
              })
            expect(response.body.user).toEqual("valid");
            expect(response.statusCode).toEqual(200)
        });

       
      });
      // describe('xyz', () => {
      //   it('abc', async() => {
      //     const response = await request.post("/users/signup").send({
      //       email: "rama2@gmail.com",
      //       username:"rama2",
      //       password: "password",
      //       cpassword:"password"
      //     })
      //   expect(response.body.user).toEqual("valid");
      //   expect(response.statusCode).toEqual(200)
   
      //   });
       
      // });
      afterAll(async () => {
        await mongoose.connection.close();
      })
     
    })
