import { GetUsersUseCase } from '../user/get-users.usecase';
import { IUsersRepository } from '../../domain/user/users-repository.interface';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { Paginated } from 'src/core/interfaces/pagination.interface';
import { UserModel } from '../../../modules/users/dtos/user.dto';

describe('GetUsersUseCase', () => {
  let useCase: GetUsersUseCase;
  let mockRepo: jest.Mocked<IUsersRepository>;

  beforeEach(() => {
    mockRepo = {
      findById: jest.fn(),
      findByUsername: jest.fn(),
      findByEmail: jest.fn(),
      createUser: jest.fn(),
      deleteUser: jest.fn(),
      getRepository: jest.fn(),
      findAllPaginated: jest.fn(),
    } as any;

    useCase = new GetUsersUseCase(mockRepo);
  });

  it('✅ should return paginated users', async () => {
    const mockUser: UserModel = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      password: 'hashedpass',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const mockPagination: Paginated<UserModel> = {
      data: [mockUser],
      meta: {
        itemsPerPage: 10,
        totalItems: 1,
        currentPage: 1,
        totalPages: 1,
      },
      links: {
        first: '/users?page=1',
        last: '/users?page=1',
        current: '/users?page=1',
        next: null,
        previous: null,
      },
    };

    mockRepo.findAllPaginated.mockResolvedValueOnce(mockPagination);

    const dto: PaginationQueryDto = { page: 1, limit: 10 };
    const result = await useCase.execute(dto);

    expect(result.data).toHaveLength(1);
    expect(result.meta.totalItems).toBe(1);
    expect(mockRepo.findAllPaginated).toHaveBeenCalledTimes(1);
  });

  it('❌ should throw InternalServerErrorException on unexpected error', async () => {
    mockRepo.findAllPaginated.mockRejectedValueOnce(new Error('unexpected error'));
    const dto: PaginationQueryDto = { page: 1, limit: 10 };

    await expect(useCase.execute(dto)).rejects.toThrow('Unexpected server error occurred.');
  });
});
