import Contact from '../modules/contact';
import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';

//@desc create the contact by token..!

const createContact = async (req: Request, res: Response) => {
    const { name, email, phone, userId } = req.body;
    if (!name || !email || !phone) {
        res.status(500).json({ msg: 'All the details should enter compulsory..!' });
    }
    const contactAvailable = await Contact.findOne({ email });
    if (contactAvailable) {
        res.send(404).json({ msg: 'Contact already registered..!' });
    }

    const contact = await Contact.create({
        name,
        email,
        phone,
        userId
    });
    console.log(`contact created ${contact}`);
    if (contact) {
        res.status(201).json({ contact: contact });
    } else {
        throw new Error('Data is not valid..!');
    }
};

//@desc Get the contact details by Id
//@route /contact/get/id
//private access specifier..!

const getContactById = asyncHandler(async (req: Request, res: Response) => {
    const contact = await Contact.findById(req.params.userId);
    if (!contact) {
        res.status(400);
        throw new Error('Contact not found..!');
    }
    if (contact.id.toString() != req.params.userId) {
        res.status(403);
        throw new Error('user do not have permission to update the contact of the other user..!');
    }
    res.status(200).json({ msg: `contact details of id = ${req.params.userId}`, contact });
});

//@desc Get the contact details by UserId
//@route /contact/get/id
//private access specifier..!

const getContactUserById = asyncHandler(async (req: Request, res: Response) => {
    const contact = await Contact.find({ userId: req.params.userId });
    res.status(200).json({ msg: contact });
});

// @deleteContactByID

const deleteContactById = asyncHandler(async (req: Request, res: Response) => {
    const contact = await Contact.findByIdAndDelete(req.params.userId);
    if (!contact) {
        res.status(400);
        throw new Error('Contact npt found..!');
    }
    if (contact.id.toString() != req.params.userId) {
        res.status(403);
        throw new Error('user do not have permission to update the contact of the other user..!');
    }
    await Contact.deleteOne({ id: req.params.id });
    res.status(200).json({ msg: `contact details of id = ${req.params.userId}`, contact });
});

// @updateContactByID

const updateContactById = asyncHandler(async (req: Request, res: Response) => {
    try {
        console.log(req.body);

        const filter = { _id: req.params.userId };
        const update = req.body;

        let updatedContact = await Contact.findOneAndUpdate(filter, update);
        //   const updatedContact = await Contact.findByIdAndUpdate(
        //     req.params.userId, // Use the contact ID to update
        //     req.body,
        //     { new: true }
        //   );
        res.status(200).json({ msg: `Contact details of id = ${req.params.userId}`, contact: updatedContact });
    } catch (error: any) {
        res.status(500).json({ error: 'An error occurred while updating the contact', message: error?.message });
    }
});

// @getAllTheContacts..!

const getContact = asyncHandler(async (req: Request, res: Response) => {
    const contact = await Contact.find();
    res.status(200).json({ msg: contact });
});

export default { createContact, getContactById, deleteContactById, updateContactById, getContact, getContactUserById };
