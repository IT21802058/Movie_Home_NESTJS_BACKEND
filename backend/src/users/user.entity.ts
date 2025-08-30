import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {UserRole} from "../utils/constants";

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
    role: UserRole;

    @Column({default:true})
    isActive: boolean;

}