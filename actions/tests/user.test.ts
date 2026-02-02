import { describe, test, expect, vi, beforeEach } from 'vitest'
import { prisma } from '@prisma/index'
// ACTIONS
import { handleUserAction, getUsers } from '../user'
// SHARED
import { COMMON_FORM_ERRORS } from '@shared-constants/common'
import { USER_FORM_LABELS, USER_FORM_ERRORS } from '@shared-constants/forms'

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn()
}))

vi.mock('next/navigation', () => ({
  redirect: vi.fn()
}))

vi.mock('@shared-functions/auth', () => ({
  hashPassword: vi.fn((password: string) => Promise.resolve(`hashed_${password}`)),
  generateJWT: vi.fn(() => 'test-token'),
  setAuthCookie: vi.fn()
}))

// MOCKS
import {
  validUserData,
  validUserData2,
  validUserDataNoLastName,
  minDaysUserData,
  maxDaysUserData,
  invalidEmailUserData,
  invalidMinDaysUserData,
  invalidMaxDaysUserData,
  invalidPasswordShortUserData,
  emptyNameUserData
} from './user.mocks.json'

const populateFormData = (
  mockedData: Record<string, string | number | null>,
  avoidKeys: string[] = []
) => {
  const baseFormData = new FormData()

  Object.entries(mockedData).forEach(([key, value]) => {
    if (!avoidKeys.includes(key) && value !== null) {
      baseFormData.append(key, value.toString())
    }
  })

  return baseFormData
}

vi.mock('@prisma/index', () => ({
  prisma: {
    userForm: {
      create: vi.fn(),
      update: vi.fn(),
      findMany: vi.fn()
    }
  }
}))

describe('User Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('[handleUserAction] - Create Mode', () => {
    test('creates user with valid data and calls prisma.userForm.create', async () => {
      vi.mocked(prisma.userForm.create).mockResolvedValue({
        id: 1,
        ...validUserData
      })

      const formData = populateFormData(validUserData)
      const result = await handleUserAction({}, formData)

      expect(result.message).toBe(USER_FORM_LABELS.CREATE_SUCCESS)
      expect(result.success).toBe(true)
      expect(result.errors).toBeUndefined()
      expect(prisma.userForm.create).toHaveBeenCalled()
    })

    test('calls prisma.userForm.create with correct parameters', async () => {
      vi.mocked(prisma.userForm.create).mockResolvedValue({
        id: 1,
        ...validUserData
      })

      const formData = populateFormData(validUserData)
      await handleUserAction({}, formData)

      expect(prisma.userForm.create).toHaveBeenCalledWith({
        data: {
          name: validUserData.name,
          lastName: validUserData.lastName,
          password: `hashed_${validUserData.password}`,
          email: validUserData.email,
          daysToNotify: validUserData.daysToNotify
        }
      })
    })

    test('creates user with null lastName', async () => {
      vi.mocked(prisma.userForm.create).mockResolvedValue({
        id: 1,
        ...validUserDataNoLastName
      })

      const formData = populateFormData(validUserDataNoLastName, ['lastName'])
      const result = await handleUserAction({}, formData)

      expect(result.success).toBe(true)
      expect(prisma.userForm.create).toHaveBeenCalled()
    })

    test('creates user with minimum valid days value (1)', async () => {
      vi.mocked(prisma.userForm.create).mockResolvedValue({
        id: 1,
        ...minDaysUserData
      })

      const formData = populateFormData(minDaysUserData)
      const result = await handleUserAction({}, formData)

      expect(result.success).toBe(true)
      expect(result.message).toBe(USER_FORM_LABELS.CREATE_SUCCESS)
    })

    test('creates user with maximum valid days value (365)', async () => {
      vi.mocked(prisma.userForm.create).mockResolvedValue({
        id: 1,
        ...maxDaysUserData
      })

      const formData = populateFormData(maxDaysUserData)
      const result = await handleUserAction({}, formData)

      expect(result.success).toBe(true)
      expect(result.message).toBe(USER_FORM_LABELS.CREATE_SUCCESS)
    })

    test('returns error when email is invalid', async () => {
      const formData = populateFormData(invalidEmailUserData)
      const result = await handleUserAction({}, formData)

      expect(result.success).toBe(false)
      expect(result.message).toBe(COMMON_FORM_ERRORS.FORM_INPUTS_ERROR)
      expect(result.errors?.email).toBeDefined()
      expect(prisma.userForm.create).not.toHaveBeenCalled()
    })

    test('returns error when daysToNotify is below minimum (0)', async () => {
      const formData = populateFormData(invalidMinDaysUserData)
      const result = await handleUserAction({}, formData)

      expect(result.success).toBe(false)
      expect(result.message).toBe(COMMON_FORM_ERRORS.FORM_INPUTS_ERROR)
      expect(result.errors?.daysToNotify).toBeDefined()
      expect(prisma.userForm.create).not.toHaveBeenCalled()
    })

    test('returns error when daysToNotify exceeds maximum (366)', async () => {
      const formData = populateFormData(invalidMaxDaysUserData)
      const result = await handleUserAction({}, formData)

      expect(result.success).toBe(false)
      expect(result.message).toBe(COMMON_FORM_ERRORS.FORM_INPUTS_ERROR)
      expect(result.errors?.daysToNotify).toBeDefined()
      expect(prisma.userForm.create).not.toHaveBeenCalled()
    })

    test('returns error when password is too short', async () => {
      const formData = populateFormData(invalidPasswordShortUserData)
      const result = await handleUserAction({}, formData)

      expect(result.success).toBe(false)
      expect(result.message).toBe(COMMON_FORM_ERRORS.FORM_INPUTS_ERROR)
      expect(result.errors?.password).toBeDefined()
      expect(result.errors?.password).toContain(USER_FORM_ERRORS.PASSWORD_MIN)
      expect(prisma.userForm.create).not.toHaveBeenCalled()
    })

    test('returns error when name is empty', async () => {
      const formData = populateFormData(emptyNameUserData)
      const result = await handleUserAction({}, formData)

      expect(result.success).toBe(false)
      expect(result.message).toBe(COMMON_FORM_ERRORS.FORM_INPUTS_ERROR)
      expect(result.errors?.name).toBeDefined()
      expect(prisma.userForm.create).not.toHaveBeenCalled()
    })

    test('converts string number to number type for daysToNotify', async () => {
      vi.mocked(prisma.userForm.create).mockResolvedValue({
        id: 1,
        ...validUserData
      })

      const formData = new FormData()
      formData.append('name', validUserData.name)
      formData.append('lastName', validUserData.lastName)
      formData.append('password', validUserData.password)
      formData.append('email', validUserData.email)
      formData.append('daysToNotify', '45')

      const result = await handleUserAction({}, formData)

      expect(result.success).toBe(true)
      expect(prisma.userForm.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          daysToNotify: 45
        })
      })
    })

    test('returns success state with correct message', async () => {
      vi.mocked(prisma.userForm.create).mockResolvedValue({
        id: 1,
        ...validUserData
      })

      const formData = populateFormData(validUserData)
      const result = await handleUserAction({}, formData)

      expect(result).toEqual({
        message: USER_FORM_LABELS.CREATE_SUCCESS,
        success: true
      })
    })
  })

  describe('[handleUserAction] - Update Mode', () => {
    test('updates user with valid data and calls prisma.userForm.update', async () => {
      vi.mocked(prisma.userForm.update).mockResolvedValue({
        id: 1,
        ...validUserData2
      })

      const formData = populateFormData(validUserData2)
      const result = await handleUserAction({}, formData, '1')

      expect(result.message).toBe(USER_FORM_LABELS.UPDATE_SUCCESS)
      expect(result.success).toBe(true)
      expect(prisma.userForm.update).toHaveBeenCalled()
    })

    test('calls prisma.userForm.update with correct parameters', async () => {
      vi.mocked(prisma.userForm.update).mockResolvedValue({
        id: 1,
        ...validUserData2
      })

      const formData = populateFormData(validUserData2)
      await handleUserAction({}, formData, '1')

      expect(prisma.userForm.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          name: validUserData2.name,
          lastName: validUserData2.lastName,
          password: `hashed_${validUserData2.password}`,
          email: validUserData2.email,
          daysToNotify: validUserData2.daysToNotify
        }
      })
    })

    test('converts string id to number for update query', async () => {
      vi.mocked(prisma.userForm.update).mockResolvedValue({
        id: 5,
        ...validUserData
      })

      const formData = populateFormData(validUserData)
      await handleUserAction({}, formData, '5')

      expect(prisma.userForm.update).toHaveBeenCalledWith({
        where: { id: 5 },
        data: expect.any(Object)
      })
    })

    test('does not call prisma.userForm.update when id is undefined', async () => {
      vi.mocked(prisma.userForm.create).mockResolvedValue({
        id: 1,
        ...validUserData
      })

      const formData = populateFormData(validUserData)
      await handleUserAction({}, formData)

      expect(prisma.userForm.update).not.toHaveBeenCalled()
      expect(prisma.userForm.create).toHaveBeenCalled()
    })
  })

  describe('[handleUserAction] - Error Handling', () => {
    test('handles database error on user creation', async () => {
      const dbError = new Error('Database connection failed')
      vi.mocked(prisma.userForm.create).mockRejectedValueOnce(dbError)

      const formData = populateFormData(validUserData)
      const result = await handleUserAction({}, formData)

      expect(result.message).toBe('Database connection failed')
      expect(result.success).toBe(false)
      expect(result.errors).toBeUndefined()
    })

    test('handles Prisma constraint error', async () => {
      const constraintError = new Error('Unique constraint failed on email')
      vi.mocked(prisma.userForm.create).mockRejectedValueOnce(constraintError)

      const formData = populateFormData(validUserData)
      const result = await handleUserAction({}, formData)

      expect(result.message).toBe('Unique constraint failed on email')
      expect(result.success).toBe(false)
    })

    test('handles error with no message', async () => {
      const error = new Error()
      vi.mocked(prisma.userForm.create).mockRejectedValueOnce(error)

      const formData = populateFormData(validUserData)
      const result = await handleUserAction({}, formData)

      expect(result.message).toBe(COMMON_FORM_ERRORS.SUBMISSION_ERROR)
      expect(result.success).toBe(false)
    })

    test('handles non-Error exceptions', async () => {
      vi.mocked(prisma.userForm.create).mockRejectedValueOnce('Unexpected error')

      const formData = populateFormData(validUserData)
      const result = await handleUserAction({}, formData)

      expect(result.message).toBe(COMMON_FORM_ERRORS.SUBMISSION_ERROR)
      expect(result.success).toBe(false)
    })

    test('handles database error on user update', async () => {
      const dbError = new Error('Update failed')
      vi.mocked(prisma.userForm.update).mockRejectedValueOnce(dbError)

      const formData = populateFormData(validUserData)
      const result = await handleUserAction({}, formData, '1')

      expect(result.message).toBe('Update failed')
      expect(result.success).toBe(false)
    })
  })

  describe('[handleUserAction] - Edge Cases', () => {
    test('handles FormData with extra fields gracefully', async () => {
      vi.mocked(prisma.userForm.create).mockResolvedValue({
        id: 1,
        ...validUserData
      })

      const formData = populateFormData(validUserData)
      formData.append('extraField', 'should be ignored')

      const result = await handleUserAction({}, formData)

      expect(result.success).toBe(true)
    })

    test('returns error when daysToNotify is a decimal number', async () => {
      const formData = new FormData()
      formData.append('name', 'Test')
      formData.append('password', 'password123')
      formData.append('email', 'test@example.com')
      formData.append('daysToNotify', '30.7')

      const result = await handleUserAction({}, formData)

      expect(result.success).toBe(false)
      expect(result.message).toBe(COMMON_FORM_ERRORS.FORM_INPUTS_ERROR)
      expect(prisma.userForm.create).not.toHaveBeenCalled()
    })

    test('handles missing required fields', async () => {
      const formData = new FormData()
      formData.append('name', 'Test')

      const result = await handleUserAction({}, formData)

      expect(result.success).toBe(false)
      expect(result.message).toBe(COMMON_FORM_ERRORS.FORM_INPUTS_ERROR)
      expect(prisma.userForm.create).not.toHaveBeenCalled()
    })
  })

  describe('[getUsers]', () => {
    test('returns list of users', async () => {
      const mockUsers = [
        { id: 1, ...validUserData },
        { id: 2, ...validUserData2 }
      ]
      vi.mocked(prisma.userForm.findMany).mockResolvedValue(mockUsers)

      const result = await getUsers()

      expect(result).toEqual(mockUsers)
      expect(prisma.userForm.findMany).toHaveBeenCalled()
    })

    test('filters users by email', async () => {
      const mockUsers = [{ id: 1, ...validUserData }]
      vi.mocked(prisma.userForm.findMany).mockResolvedValue(mockUsers)

      await getUsers('john')

      expect(prisma.userForm.findMany).toHaveBeenCalledWith({
        where: {
          email: {
            contains: 'john',
            mode: 'insensitive'
          }
        }
      })
    })

    test('returns empty array when no users exist', async () => {
      vi.mocked(prisma.userForm.findMany).mockResolvedValue([])

      const result = await getUsers()

      expect(result).toEqual([])
      expect(prisma.userForm.findMany).toHaveBeenCalled()
    })

    test('calls prisma.userForm.findMany with correct parameters', async () => {
      vi.mocked(prisma.userForm.findMany).mockResolvedValue([])

      await getUsers('test@example.com')

      expect(prisma.userForm.findMany).toHaveBeenCalledWith({
        where: {
          email: {
            contains: 'test@example.com',
            mode: 'insensitive'
          }
        }
      })
    })

    test('handles empty email parameter', async () => {
      vi.mocked(prisma.userForm.findMany).mockResolvedValue([])

      await getUsers('')

      expect(prisma.userForm.findMany).toHaveBeenCalledWith({
        where: {
          email: {
            contains: '',
            mode: 'insensitive'
          }
        }
      })
    })

    test('handles database error on getUsers', async () => {
      const dbError = new Error('Database error')
      vi.mocked(prisma.userForm.findMany).mockRejectedValueOnce(dbError)

      await expect(getUsers()).rejects.toThrow('Database error')
    })
  })
})
