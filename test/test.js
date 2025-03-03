//During the test the env variable is set to test
process.env.NODE_ENV = "test";
let PORT = process.env.API_PORT;
//Require the dev-dependencies
import {use} from 'chai';
import chaiHttp from 'chai-http';

const chai = use(chaiHttp);
let server = "localhost:" + 2222;
let should = chai.should();

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlRlc3QiLCJpYXQiOjE3NDA5NjgxMTIsImV4cCI6MTc0MDk2OTkxMn0.8Flrdx0pleMd7FIxaxssu43jQ8md_ekrK9TUsF_X4OA";

chai.use(chaiHttp);
//Our parent block
describe("Tasks", () => {
	/*
	 * Test the /GET route
	 */
    

    describe("/GET auth", () => {
		it("it should GET an auth token", (done) => {
			chai.request.execute(server)
                .get("/auth")
                .send({username:"username"})
                .end((err,res) =>{
                    res.should.have.status(200);
                    done();
            })
		});
	});
	describe("/GET task", () => {
		it("it should GET all the tasks", (done) => {
			chai.request.execute(server)
				.get("/tasks")
                .set({ "Authorization": `Bearer ${token}` })
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a("array");
					done();
				});
		});
	});
	describe("/POST task", () => {
		
		it("it should POST a task ", (done) => {
			let task = {
				title: "Task title",
				description: "Task Description",
				status: "pending",
			};
			chai.request.execute(server)
				.post("/tasks")
                .set({ "Authorization": `Bearer ${token}` })
				.send(task)
				.end((err, res) => {
					res.should.have.status(201);
					res.text.should.be.a("string");
					done();
				});
		});
	});
	describe("/GET/:id task", () => {
		it("it should GET a task by the given id", (done) => {
			let task = {
				title: "Task title",
				description: "Task Description",
				status: "pending",
			};

			chai.request.execute(server)
				.post("/tasks")
                .set({ "Authorization": `Bearer ${token}` })
				.send(task)
				.end((err, res) => {
					task.id = res.text;
					chai.request.execute(server)
						.get("/tasks/" + task.id)
                        .set({ "Authorization": `Bearer ${token}` })
						.end((err, res) => {
							res.should.have.status(200);
							res.body.should.be.a("object");
							res.body.should.have.property("_id").eql(task.id);
							done();
						});
				});
		});
		it("it should not GET a task with an invalid ID", (done) => {
			chai.request.execute(server)
				.get("/tasks/0")
                .set({ "Authorization": `Bearer ${token}` })
				.end((err, res) => {
					res.should.have.status(500);
					res.text.should.eq("BSONError: hex string must be 24 characters");
					done();
				});
		});
        it("it should not GET a task with unused ID", (done) => {
			chai.request.execute(server)
				.get("/tasks/67c4f1e8feb24b1141ac3ae9")
                .set({ "Authorization": `Bearer ${token}` })
				.end((err, res) => {
					res.should.have.status(404);
					done();
				});
		});
	});
	describe("/PUT/:id task", () => {
		it("it should PUT a task by the given id", (done) => {
			let task = {
				title: "Task title",
				description: "Task Description",
				status: "pending",
			};
			let newtitle = "NEWTASKTITLE";
			chai.request.execute(server)
				.post("/tasks")
                .set({ "Authorization": `Bearer ${token}` })
				.send(task)
				.end((err, res) => {
					task.id = res.text;
					chai.request.execute(server)
						.patch("/tasks/" + task.id)
                        .set({ "Authorization": `Bearer ${token}` })
						.send({
							title: newtitle,
						})
						.end((err, res) => {
							res.should.have.status(200);
							res.text.should.eq('1');
							done();
						});
				});
		});
		it("it should not PUT a task with unused ID", (done) => {
			chai.request.execute(server)
				.put("/tasks/67c4f1e8feb24b1141ac3ae9")
                .set({ "Authorization": `Bearer ${token}` })
				.end((err, res) => {
					res.should.have.status(404);
					done();
				});
		});
	});
	describe("/DELETE/:id task", () => {
		it("it should DELETE a task by the given id", (done) => {
			let task = {
				title: "Task title",
				description: "Task Description",
				status: "pending",
			};

			chai.request.execute(server)
				.post("/tasks")
                .set({ "Authorization": `Bearer ${token}` })
				.send(task)
				.end((err, res) => {
					task.id = res.text;
					chai.request.execute(server)
						.delete("/tasks/" + task.id)
                        .set({ "Authorization": `Bearer ${token}` })
						.end((err, res) => {
							res.should.have.status(204);
							res.body.should.be.an("object").that.is.empty;
							done();
						});
				});
		});
		it("it should not DELETE a task with unused ID", (done) => {
			chai.request.execute(server)
				.delete("/tasks/67c4f1e8feb24b1141ac3ae9")
                .set({ "Authorization": `Bearer ${token}` })
				.end((err, res) => {
					res.should.have.status(404);
					res.text.should.contain("No task found with id");
					res.body.should.be.an("object").that.is.empty;
					done();
				});
		});
	});
});