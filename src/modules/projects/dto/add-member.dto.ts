import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { MemberRole } from "src/common/enums/member-role.enum";

export class AddMemberDto {
    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsEnum(MemberRole)
    role: MemberRole;
}