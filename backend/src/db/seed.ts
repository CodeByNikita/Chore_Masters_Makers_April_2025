import { ChildModel } from "../models/child.js";
import { ParentModel } from "../models/parent.js";
import { PrizeModel } from "../models/prize.js";
import { TaskModel } from "../models/task.js";
import connectToDatabase from "./dbConnection.js";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const seedDatabase = async (): Promise<void> => {
  await connectToDatabase();
  await ChildModel.collection.drop();
  await ParentModel.collection.drop();
  await PrizeModel.collection.drop();
  await TaskModel.collection.drop();

  const prize1 = await PrizeModel.create({
    name: "Lego",
    value: 100,
    imageURL:
      "https://media.istockphoto.com/id/1179503632/photo/heap-of-plastic-block-toy-background.jpg?s=2048x2048&w=is&k=20&c=nblndeeGzvnHuRLWXOQNpSUTMybQcy27vhfjM7mi0pA=",
  });

  const prize2 = await PrizeModel.create({
    name: "Barbie",
    value: 80,
    imageURL:
      "https://media.istockphoto.com/id/487695805/photo/barbie-doll-group-shot.jpg?s=2048x2048&w=is&k=20&c=E9llNe9IdhIfAmHjqDqf1yi_Cho6sYzfhw_P5-GEDq0=",
  });

  const task1 = await TaskModel.create({
    name: "Vacuuming",
    value: 20,
    imageURL:
      "https://media.istockphoto.com/id/1936830995/vector/vacuum-cleaner-on-white-background.jpg?s=2048x2048&w=is&k=20&c=aXsUlevhZ_iu10MYcASE_G0OiweNNBmkris32brHAco=",
  });

  const task2 = await TaskModel.create({
    name: "Washing dishes",
    value: 10,
    imageURL:
      "https://media.istockphoto.com/id/1287750016/vector/plate-and-sponge-in-hand-line-and-solid-icon-hygiene-routine-concept-dishwashing-sign-on.jpg?s=2048x2048&w=is&k=20&c=dxlSOK6auZy-IR2C9a2rOZerj2gus5EcqqsJMCldTkA=",
  });

  const task3 = await TaskModel.create({
    name: "Laundry",
    value: 15,
    imageURL:
      "https://media.istockphoto.com/id/156396667/vector/cartoon-washing-machine.jpg?s=2048x2048&w=is&k=20&c=Zk94Vty95QwEl2jQ10phl34M0givF7_ra4hexsKlx5g=",
  });

  const task4 = await TaskModel.create({
    name: "Brushing teeth",
    value: 25,
    imageURL:
      "https://media.istockphoto.com/id/167588044/vector/tooth-mascot.jpg?s=2048x2048&w=is&k=20&c=QDcMVMt0rDFvE7VrWdyoZHDnUp2NBjW43gxt2htZ7Zw=",
  });

  const task5 = await TaskModel.create({
    name: "Making Bed",
    value: 30,
    imageURL:
      "https://media.istockphoto.com/id/2185032034/vector/plus-size-black-woman-tidying-up-her-bed-household-work-housekeeping.jpg?s=2048x2048&w=is&k=20&c=H51RbTri55hKjA1CDme_C34f0m30dBvTRAyr5AVnOPQ=",
  });

  const child1 = await ChildModel.create({
    username: "Cheeky Boy",
    password: "Password1",
    prize: prize1,
    tasksCompleted: [],
    tasksNotCompleted: [task1, task3, task5],
    points: 0,
    imageURL:
      "https://media.istockphoto.com/id/164452038/vector/young-red-headed-boy-makes-silly-face-using-tongue-and-hands.jpg?s=2048x2048&w=is&k=20&c=HX68yvz1MV6QTSMhgWc5zQB_1OsCGF4nEEFqvKc7NLo=",
  });

  const child2 = await ChildModel.create({
    username: "Princess Girl",
    password: "Password2",
    prize: prize2,
    tasksCompleted: [],
    tasksNotCompleted: [task2, task4],
    points: 0,
    imageURL:
      "https://media.istockphoto.com/id/2207691230/vector/greeting-card-with-cute-cartoon-fairy-tale-princess-and-stars-little-girl-on-a-pink-dress-in.jpg?s=2048x2048&w=is&k=20&c=cYI3wtBFbXl95f5EkACVdBqdcqLKYCmSKDIx29Ng9XI=",
  });

  await ParentModel.create({
    username: "Loving Mama",
    password: "Password3",
    usersChildren: [child1, child2],
    tasks: [task1, task2, task3, task4, task5],
    profilePic:
      "https://media.istockphoto.com/id/945446894/vector/children-boy-and-girl-daughter-and-son-kissing-hugging-their-mom-happy-mothers-day-isolated.jpg?s=2048x2048&w=is&k=20&c=_4olUWe7OY2IKvz2KqwLrMCuVweWW78aVHjLiN-1sms=",
    prizes: [prize1, prize2],
  });

  mongoose.disconnect();
};

await seedDatabase();
