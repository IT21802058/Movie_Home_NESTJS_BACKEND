import {ConflictException, Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "./user.entity";
import {QueryFailedError, Repository} from "typeorm";
import {CreateUserDto} from "../dtos/create-user.dto";
import * as bcrypt from 'bcryptjs';
import {UserRole} from "../utils/constants";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {}

    async create(createUserDto: CreateUserDto): Promise<User> {
        try {
            const { email, password, role = UserRole.USER } = createUserDto;

            const existingUser = await this.usersRepository.findOne({ where: { email } });
            if (existingUser) {
                throw new ConflictException('Email already registered');
            }

            const hashed = await bcrypt.hash(password, 10);
            const user = this.usersRepository.create({ email, password: hashed, role });
            return await this.usersRepository.save(user);

        } catch (error) {
            if (error instanceof QueryFailedError) {
                // Handle specific SQL errors
                if (error.message.includes('duplicate key')) {
                    throw new ConflictException('Email already registered');
                }
            }
            // Let global filter handle unexpected errors
            throw error;
        }
    }

    async findOneByEmail(email: string): Promise<User | null> {
        return await this.usersRepository.findOne({ where: { email } });
    }

    async findOneById(id: string): Promise<User | null> {
        return await this.usersRepository.findOne({ where: { id } });
    }

    async findAll(): Promise<User[]> {
        return await this.usersRepository.find();
    }
}