import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { DepartamentPermissions } from '../entities/departament-permissions.entity';
import { CreateDepartamentPermissionPayload } from '../dtos/create-departament-permission-payload';
import { InjectRepository } from '@nestjs/typeorm';
import { Departament } from 'src/modules/departaments/entities/departament.entity';

@Injectable()
export class DepartamentPermissionsService {
  constructor(
    @InjectRepository(DepartamentPermissions)
    private readonly departamentPermissionsRepository: Repository<DepartamentPermissions>,

    @InjectRepository(Departament)
    private readonly departamentRepository: Repository<Departament>,
  ) {}
  public async createDepartamentPermission(
    data: CreateDepartamentPermissionPayload,
  ): Promise<any> {
    const permissionsDepartaments = [];
    await Promise.all(
      data.departaments.map(async (departamentId) => {
        const department = this.departamentPermissionsRepository.create({
          documentId: data.documentId,
          isAuthorized: data.isAuthorized,
          departamentId,
        });

        const departamentPermission =
          await this.departamentPermissionsRepository.save(department);

        const departament = await this.departamentRepository.findOne({
          where: { id: departamentId },
        });

        permissionsDepartaments.push({
          ...departamentPermission,
          departament,
          departamentName: departament.name,
        });
      }),
    );
    return permissionsDepartaments;
  }

  async getDepartamentPermission(documentId: string) {
    const departamentPermission =
      await this.departamentPermissionsRepository.find({
        where: { documentId },
        relations: ['department'],
      });

    departamentPermission.forEach((departamentPermission) => {
      departamentPermission['departamentName'] =
        departamentPermission.department.name;
    });

    return departamentPermission;
  }

  async deleteDepartamentPermission(id: number) {
    const departamentPermission =
      await this.departamentPermissionsRepository.findOne({
        where: { id },
        relations: ['department'],
      });

    return await this.departamentPermissionsRepository.remove(
      departamentPermission,
    );
  }
}
